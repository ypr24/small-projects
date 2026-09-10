// uploaded at server on the address : 0xbe836e4f91733531d83229fd9d225d8a68bf26e7
pragma solidity >=0.7.0 <0.8.0;

contract Bank{

    struct Account{
        string name;
        string email;
        uint amount;
    }

    mapping(address => Account) accounts;
    mapping(address => bool) whitelisted;
    mapping(string => address) emailIdToAccountID;


    modifier onlyWhitelist {
        require(whitelisted[msg.sender] == false, "account already exists.");
        _;
    }
    
    event checkInfo(string name,string email, uint amount);
    
    function createAccount(string memory name, string memory email) 
        public onlyWhitelist {
      
        accounts[msg.sender] = Account(name,email,0);
        whitelisted[msg.sender] = true;
        emailIdToAccountID[email] = msg.sender;
        
        emit checkInfo(
            accounts[msg.sender].name, 
            accounts[msg.sender].email, 
            accounts[msg.sender].amount
        ); 
    }
    
    modifier onlyExisting {
        require(whitelisted[msg.sender] == true, "account not created.");
        _;
    }

    
    function getAccountInfo() public onlyExisting{
        
        emit checkInfo(
            accounts[msg.sender].name, 
            accounts[msg.sender].email, 
            accounts[msg.sender].amount
        ); 
    }

    // get and reset email and name

    function getEmail() public onlyExisting {
        emit checkInfo(
            accounts[msg.sender].name, 
            accounts[msg.sender].email, 
            accounts[msg.sender].amount
        ); 
    }
    
    
    function resetEmail(string memory email) public onlyExisting {
        accounts[msg.sender].email = email;
        emailIdToAccountID[email] = msg.sender;
        
        emit checkInfo(
            accounts[msg.sender].name, 
            accounts[msg.sender].email, 
            accounts[msg.sender].amount
        ); 
    }
    

    function getName() public onlyExisting {
        emit checkInfo(
            accounts[msg.sender].name, 
            accounts[msg.sender].email, 
            accounts[msg.sender].amount
        ); 
    }
    

    function resetName(string memory name) public onlyExisting {
        accounts[msg.sender].name = name;
        emit checkInfo(
            accounts[msg.sender].name, 
            accounts[msg.sender].email, 
            accounts[msg.sender].amount
        ); 
    }
    
    // 2. Banking Transactions
    
    event checkbalance(uint amount);

    function getBalance() public onlyExisting{
        emit checkbalance(accounts[msg.sender].amount);
        emit checkInfo(
            accounts[msg.sender].name, 
            accounts[msg.sender].email, 
            accounts[msg.sender].amount
        ); 
    }
    
    // deposit and withdraw money..
    
    event checkDeposit(uint amount);
    
    function deposit(uint amt) public onlyExisting {
        accounts[msg.sender].amount += amt;
        emit checkDeposit(accounts[msg.sender].amount);
        emit checkInfo(
            accounts[msg.sender].name, 
            accounts[msg.sender].email, 
            accounts[msg.sender].amount
        ); 
    }
    
    modifier withdrawLimit(uint amt){
        require(amt <= accounts[msg.sender].amount,"insufficient balance");
        _;
    }
    
    event checkWithdraw(uint amount);
    
    function withdraw(uint amt) public withdrawLimit(amt) onlyExisting {
        accounts[msg.sender].amount -= amt;
        emit checkWithdraw(accounts[msg.sender].amount);
        emit checkInfo(
            accounts[msg.sender].name, 
            accounts[msg.sender].email, 
            accounts[msg.sender].amount
        ); 

    }
    
    // transfer money from your account to someone else
    
    event checkTransfer(string emailFrom, address emailTo, uint amount);
   
    modifier toNullAddress(string memory toEmail){
        require(emailIdToAccountID[toEmail] != address(0),"reciepent not valid");
        _;
    }
    
    function moneytransfer(uint amt, string memory toEmail) 
        public withdrawLimit(amt) toNullAddress(toEmail) onlyExisting{
        
        address toAccount = emailIdToAccountID[toEmail];

        accounts[msg.sender].amount -= amt;
        accounts[toAccount].amount += amt;
        
        emit checkTransfer(accounts[msg.sender].email, emailIdToAccountID[toEmail], amt);
        emit checkInfo(
            accounts[msg.sender].name, 
            accounts[msg.sender].email, 
            accounts[msg.sender].amount
        ); 
    }
    
}

