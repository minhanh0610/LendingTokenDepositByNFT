// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

// Import this file to use console.log
import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract LendingToken is Ownable, IERC721Receiver {
    using Counters for Counters.Counter;
    Counters.Counter private _loanIds;

    uint256 public TIME_DURATION;

    function setTime(uint256 time) public onlyOwner {
        TIME_DURATION = time;
    }

    function calculateFee(
        uint256 amount,
        uint256 num,
        uint256 de
    ) external pure returns (uint256) {
        Rational memory r = Rational(num, de);
        uint256 result = multiply(amount, r);
        return result;
    }

    //The loan can be in 6 states . Created, Rejected, Taken, EarlyRepaied, Repaied, Liquidated
    enum LoanState {
        Created,
        Rejected,
        Taken,
        Repaied,
        EarlyRepaied,
        Liquidated,
        Cancel,
        Withdraw
    }

    // The structure of the loan agreement
    struct LoanAgreement {
        address borrower;
        address nft;
        uint256 nftTokenId;
        address token;
        uint256 loanAmount;
        uint256 payoffAmount;
        uint256 startDate;
        uint256 loanDuration;
        uint256 dueDate;
        LoanState state;
        uint256 createdAt;
    }

    mapping(address => mapping(uint256 => uint256)) public _nftToLoanIds;
    mapping(uint256 => LoanAgreement) public loanAgreements;
    mapping(address => Token) public listingsToken;

    event LoanRequest(
        uint256 loanId,
        address borrower,
        address nft,
        uint256 nftTokenId,
        address tokenAddr,
        uint256 loanAmount,
        uint256 payoffAmount,
        uint256 loanDuration,
        LoanState state,
        uint256 createdAt
    );

    // borrower must approve nft
    // borrower send request loan to smart contract
    function requestLoan(
        address nft,
        uint256 nftTokenId,
        address tokenAddr,
        uint256 loanAmount,
        uint256 loanDuration
    ) public {
        require(msg.sender != address(0), "Caller is the zero address");
        require(nft != address(0), "Nft address is the zero address");
        require(msg.sender != owner(), "Caller have not to be admin");
        require(
            _nftToLoanIds[nft][nftTokenId] == 0,
            "NFT has uses as collateral"
        );
        require(loanAmount > 0, "Invalid loan amount");
        require(loanDuration == TIME_DURATION, "invalid loan duration");

        //allowance borrower
        IERC721 nftAsset = IERC721(nft);
        require(
            msg.sender == nftAsset.ownerOf(nftTokenId),
            "Caller must be owner nft"
        );
        require(
            nftAsset.getApproved(nftTokenId) == address(this),
            "Caller did not approve for nftTokenId token."
        );

        Token memory token = listingsToken[tokenAddr];

        uint256 payoffAmount = calculate(loanAmount, token.interestRate);
        uint256 createdAt = block.timestamp;
        // uint256 duaDate = createdAt + loanDuration * 1 days;

        _loanIds.increment();
        uint256 newLoanId = _loanIds.current();
        _nftToLoanIds[nft][nftTokenId] = newLoanId;
        LoanAgreement memory loanAgreement = LoanAgreement(
            msg.sender,
            nft,
            nftTokenId,
            tokenAddr,
            loanAmount,
            payoffAmount,
            0,
            loanDuration,
            0,
            LoanState.Created,
            createdAt
        );

        loanAgreements[newLoanId] = loanAgreement;
        emit LoanRequest(
            newLoanId,
            msg.sender,
            nft,
            nftTokenId,
            tokenAddr,
            loanAmount,
            payoffAmount,
            loanDuration,
            LoanState.Created,
            createdAt
        );
    }

    function getLoanId(address nft, uint256 nftTokenId)
        public
        view
        returns (uint256)
    {
        require(
            _nftToLoanIds[nft][nftTokenId] != 0,
            "NFT has not use as collateral"
        );
        return _nftToLoanIds[nft][nftTokenId];
    }

    function getLoanAgreement(address nft, uint256 nftTokenId)
        public
        view
        returns (LoanAgreement memory loanAgreement)
    {
        require(
            msg.sender != address(0),
            "address zero is not a valid address"
        );
        require(
            _nftToLoanIds[nft][nftTokenId] != 0,
            "NFT has not use as collateral"
        );
        uint256 loanId = _nftToLoanIds[nft][nftTokenId];
        require(
            msg.sender == owner() ||
                msg.sender == loanAgreements[loanId].borrower,
            "Caller must be owner nft or admin"
        );

        return loanAgreements[loanId];
    }

    function calculate(uint256 loanAmount, Rational memory rate)
        internal
        pure
        returns (uint256)
    {
        return loanAmount + multiply(loanAmount, rate);
    }

    event LoanAcceptedOrRejected(
        uint256 loanId,
        LoanState state,
        uint256 startDate,
        uint256 dueDate
    );

    //Taking the loan
    //lender phải approve cho admin
    // Admin must accept or reject the loan
    function takeALoan(
        address nft,
        uint256 nftTokenId,
        LoanState state
    ) public onlyOwner {
        require(
            _nftToLoanIds[nft][nftTokenId] != 0,
            "NFT has not use as collateral"
        );
        require(
            state == LoanState.Rejected || state == LoanState.Taken,
            "invalid state input"
        );
        uint256 loanId = _nftToLoanIds[nft][nftTokenId];
        LoanAgreement storage loanAgreement = loanAgreements[loanId];
        IERC721 nftAsset = IERC721(loanAgreement.nft);
        require(
            loanAgreement.borrower ==
                nftAsset.ownerOf(loanAgreement.nftTokenId),
            "Borrower must be owner nft"
        );

        IERC20 token = IERC20(loanAgreement.token);

        require(loanAgreement.state == LoanState.Created, "Invalid Loan state");

        loanAgreement.state = state;
        uint256 startDate = block.timestamp;
        uint256 dueDate = startDate + (loanAgreement.loanDuration) * 1 days;
        if (state == LoanState.Taken) {
            loanAgreement.startDate = startDate;
            loanAgreement.dueDate = dueDate;

            nftAsset.safeTransferFrom(
                loanAgreement.borrower,
                address(this),
                loanAgreement.nftTokenId
            );
            bool sent = token.transfer(
                loanAgreement.borrower,
                loanAgreement.loanAmount
            );
            require(sent, "Token transfer failed");
        } else {
            _nftToLoanIds[nft][nftTokenId] = 0;
        }
        emit LoanAcceptedOrRejected(loanId, state, startDate, dueDate);
    }

    event LoanRepaied(uint256 loanId, LoanState state, uint256 repaiedAt);

    //borrower repay the loan
    function repayLoan(address nft, uint256 nftTokenId) public {
        require(
            _nftToLoanIds[nft][nftTokenId] != 0,
            "NFT has not use as collateral"
        );
        uint256 loanId = _nftToLoanIds[nft][nftTokenId];
        LoanAgreement storage loanAgreement = loanAgreements[loanId];
        require(
            msg.sender == loanAgreement.borrower,
            "Caller must be borrower"
        );
        require(
            loanAgreement.state == LoanState.Taken,
            "Loan state is invalid"
        );
        uint256 repaiedAt = block.timestamp;
        require(
            repaiedAt < loanAgreement.dueDate &&
                repaiedAt >= loanAgreement.dueDate - 1 days,
            "Invalid time repayment"
        );

        IERC20(loanAgreement.token).transferFrom(
            msg.sender,
            address(this),
            loanAgreement.payoffAmount
        );

        IERC721(loanAgreement.nft).safeTransferFrom(
            address(this),
            loanAgreement.borrower,
            loanAgreement.nftTokenId
        );
        _nftToLoanIds[loanAgreement.nft][loanAgreement.nftTokenId] = 0;
        loanAgreement.state = LoanState.Repaied;
        emit LoanRepaied(loanId, LoanState.Repaied, repaiedAt);
    }

    event PaymentMissing(uint256 loanId, LoanState state, uint256 currentTime);

    function missedPayment(address nft, uint256 nftTokenId)
        public
        returns (bool)
    {
        require(
            _nftToLoanIds[nft][nftTokenId] != 0,
            "NFT has not use as collateral"
        );
        uint256 loanId = _nftToLoanIds[nft][nftTokenId];
        LoanAgreement storage loanAgreement = loanAgreements[loanId];
        require(
            loanAgreement.state == LoanState.Taken ||
                loanAgreement.state == LoanState.Created,
            "Loan state is invalid"
        );
        uint256 currentTime = block.timestamp;
        if (
            currentTime > loanAgreement.dueDate &&
            loanAgreement.state == LoanState.Taken
        ) {
            loanAgreement.state = LoanState.Liquidated;
            emit PaymentMissing(loanId, loanAgreement.state, currentTime);
            return true;
        }

        if (
            currentTime > loanAgreement.dueDate &&
            loanAgreement.state == LoanState.Created
        ) {
            loanAgreement.state = LoanState.Cancel;
            _nftToLoanIds[nft][nftTokenId] = 0;
            emit PaymentMissing(loanId, loanAgreement.state, currentTime);
            return true;
        }

        return false;
    }

    event NftWithdraw(address nft, uint256 nftTokenId);
    //Liquidating the loan
    //withdraw
    function liquidate(address nft, uint256 nftTokenId) public onlyOwner {
        require(
            _nftToLoanIds[nft][nftTokenId] != 0,
            "NFT has not use as collateral"
        );
        uint256 loanId = _nftToLoanIds[nft][nftTokenId];
        LoanAgreement storage loanAgreement = loanAgreements[loanId];
        require(
            loanAgreement.state == LoanState.Liquidated,
            "Loan status is not correct"
        );

        IERC721(loanAgreement.nft).safeTransferFrom(
            address(this),
            owner(),
            loanAgreement.nftTokenId
        );
        loanAgreement.state = LoanState.Withdraw;
        emit NftWithdraw(nft, nftTokenId);
    }

    event LoanExtension(
        uint256 loanId,
        uint256 extendedAt,
        uint256 extendedDuration,
        uint256 extendFee,
        uint256 dueDate
    );

    function extendLoan(
        address nft,
        uint256 nftTokenId,
        uint256 extendedDuration
    ) public {
        require(
            _nftToLoanIds[nft][nftTokenId] != 0,
            "NFT has not use as collateral"
        );
        require(extendedDuration == TIME_DURATION, "Loan extension is limited");
        uint256 loanId = _nftToLoanIds[nft][nftTokenId];
        LoanAgreement storage loanAgreement = loanAgreements[loanId];
        require(
            loanAgreement.state == LoanState.Taken,
            "Loan state is invalid"
        );
        uint256 extendedFee = multiply(
            loanAgreement.loanAmount,
            listingsToken[loanAgreement.token].extendedRate
        );

        IERC20(loanAgreement.token).transferFrom(
            msg.sender,
            address(this),
            extendedFee
        );
        uint256 extendedAt = block.timestamp;
        uint256 dueDate = loanAgreement.dueDate;
        loanAgreement.dueDate = dueDate + extendedDuration * 1 days;

        emit LoanExtension(
            loanId,
            extendedAt,
            extendedDuration,
            extendedFee,
            loanAgreement.dueDate
        );
    }

    event LoanRepaiedEarly(
        uint256 loanId,
        LoanState state,
        uint256 repaiedEarlyAt,
        uint256 repaiedEarlyFee
    );

    function repaiedEarly(address nft, uint256 nftTokenId) public {
        require(
            _nftToLoanIds[nft][nftTokenId] != 0,
            "NFT has not use as collateral"
        );
        uint256 loanId = _nftToLoanIds[nft][nftTokenId];
        LoanAgreement storage loanAgreement = loanAgreements[loanId];
        require(
            msg.sender == loanAgreement.borrower,
            "Caller must be owner nft"
        );
        require(
            loanAgreement.state == LoanState.Taken,
            "Loan state is invalid"
        );
        uint256 repaiedEarlyAt = block.timestamp;
        require(
            repaiedEarlyAt < loanAgreement.dueDate - 1 days,
            "Early liquidation time is invalid"
        );

        uint256 repaiedEarlyFee = multiply(
            loanAgreement.loanAmount,
            listingsToken[loanAgreement.token].earlyRate
        );
        IERC20(loanAgreement.token).transferFrom(
            msg.sender,
            address(this),
            repaiedEarlyFee + loanAgreement.payoffAmount
        );
        IERC721(loanAgreement.nft).safeTransferFrom(
            address(this),
            loanAgreement.borrower,
            loanAgreement.nftTokenId
        );
        loanAgreement.state = LoanState.EarlyRepaied;

        emit LoanRepaiedEarly(
            loanId,
            loanAgreement.state,
            repaiedEarlyAt,
            repaiedEarlyFee
        );
    }

    /////////////////////////////////////////////////////
    //ADMIN
    event TokenDeposit(address token, uint256 amount);

    function deposit(address token, uint256 amount) public onlyOwner {
        require(token != address(0), "Token address is the zero address");
        require(amount > 0, "Amount token is too low");
        IERC20(token).transferFrom(msg.sender, address(this), amount);
        emit TokenDeposit(token, amount);
    }

    event TokenWithdraw(address token, uint256 amount);

    function withdraw(address token, uint256 amount) public onlyOwner {
        require(token != address(0), "Token address is the zero address");
        require(amount > 0, "Amount token is too low");
        IERC20(token).transfer(msg.sender, amount);
        emit TokenWithdraw(token, amount);
    }

    struct Rational {
        uint256 numerator;
        uint256 denominator;
    }

    //caculate rate
    function multiply(uint256 x, Rational memory r)
        internal
        pure
        returns (uint256)
    {
        if (x == 0) {
            return 0;
        }
        uint256 v = x * r.numerator;
        assert(v / x == r.numerator); // avoid overflow
        return v / r.denominator;
    }

    struct Token {
        address seller;
        address addr;
        string symbol;
        uint8 decimals;
        // rate
        Rational interestRate; // lãi hàng năm - APR
        Rational extendedRate; // lãi gia hạn
        Rational earlyRate; //lãi thanh lý sớm
        bool exists;
    }

    event AddTokenRate(
        address token,
        string symbol,
        uint8 decimals,
        uint256 interestRateNumerator,
        uint256 interestRateDenominator,
        uint256 extendedRateNumerator,
        uint256 extendedRateDenominator,
        uint256 earlyRateNumerator,
        uint256 earlyRateDenominator
    );

    function addToken(
        address tokenAddr,
        uint256 interestRateNumerator,
        uint256 interestRateDenominator,
        uint256 extendedRateNumerator,
        uint256 extendedRateDenominator,
        uint256 earlyRateNumerator,
        uint256 earlyRateDenominator
    ) public onlyOwner {
        require(tokenAddr != address(0), "Token address is the zero address");
        require(listingsToken[tokenAddr].exists == false, "Token existed");
        require(
            interestRateNumerator > 0 &&
                interestRateDenominator > 0 &&
                extendedRateNumerator > 0 &&
                extendedRateDenominator > 0 &&
                earlyRateNumerator > 0 &&
                earlyRateDenominator > 0,
            "Rate must be > 0"
        );
        Rational memory interestRate = Rational(
            interestRateNumerator,
            interestRateDenominator
        );
        Rational memory extendedRate = Rational(
            extendedRateNumerator,
            extendedRateDenominator
        );
        Rational memory earlyRate = Rational(
            earlyRateNumerator,
            earlyRateDenominator
        );
        string memory symbol = ERC20(tokenAddr).symbol();
        uint8 decimals = ERC20(tokenAddr).decimals();

        Token memory token = Token(
            msg.sender,
            tokenAddr,
            symbol,
            decimals,
            interestRate,
            extendedRate,
            earlyRate,
            true
        );
        listingsToken[tokenAddr] = token;

        emit AddTokenRate(
            tokenAddr,
            symbol,
            decimals,
            interestRateNumerator,
            interestRateDenominator,
            extendedRateNumerator,
            extendedRateDenominator,
            earlyRateNumerator,
            earlyRateDenominator
        );
    }

    event UpdateTokenRate(
        address tokenAddr,
        uint256 interestRateNumerator,
        uint256 interestRateDenominator,
        uint256 extendedRateNumerator,
        uint256 extendedRateDenominator,
        uint256 earlyRateNumerator,
        uint256 earlyRateDenominator
    );

    function updateToken(
        address tokenAddr,
        uint256 interestRateNumerator,
        uint256 interestRateDenominator,
        uint256 extendedRateNumerator,
        uint256 extendedRateDenominator,
        uint256 earlyRateNumerator,
        uint256 earlyRateDenominator
    ) public onlyOwner {
        require(listingsToken[tokenAddr].exists == true, "Token must exist");
        require(
            interestRateNumerator > 0 &&
                interestRateDenominator > 0 &&
                extendedRateNumerator > 0 &&
                extendedRateDenominator > 0 &&
                earlyRateNumerator > 0 &&
                earlyRateDenominator > 0,
            "Rate must be > 0"
        );
        Token storage token = listingsToken[tokenAddr];
        token.interestRate.numerator = interestRateNumerator;
        token.interestRate.denominator = interestRateDenominator;
        token.extendedRate.numerator = extendedRateNumerator;
        token.extendedRate.denominator = extendedRateDenominator;
        token.earlyRate.numerator = earlyRateNumerator;
        token.earlyRate.denominator = earlyRateDenominator;

        emit UpdateTokenRate(
            tokenAddr,
            interestRateNumerator,
            interestRateDenominator,
            extendedRateNumerator,
            extendedRateDenominator,
            earlyRateNumerator,
            earlyRateDenominator
        );
    }

    function getTokenErc(address tokenAddr)
        public
        view
        returns (Token memory token)
    {
        require(
            msg.sender != address(0),
            "address zero is not a valid address"
        );
        return listingsToken[tokenAddr];
    }

    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external override returns (bytes4) {
        return
            bytes4(
                keccak256("onERC721Received(address,address,uint256,bytes)")
            );
    }
}
