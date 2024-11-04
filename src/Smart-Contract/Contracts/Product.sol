// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
contract Product {
    struct Transaction {
        uint256 txId;
        address from;
        address to;
        uint date;
    }

    struct RawProduct {
        string name;
        bool isVerified;
    }

    struct Item {
        uint256 id;
        string title;
        address manufacturer;
        address currentOwner;
        address lastOwner;
        uint launchDate;
        string material;
        string status;
        string tempStatus;
        string longStatus;
        string radioactivityLevel;
        string dimensions;
    }

    uint256[] public _itemIds;
    mapping(uint256 => Item) public _items;
    mapping(uint256 => Transaction) _transactions;
    mapping(uint256 => uint256[]) _itemTransactions;
    mapping(uint256 => RawProduct[]) _itemRawProducts;

    uint256 _nextTransactionId;

    constructor() {
        _nextTransactionId = 0;
    }

    modifier itemExists(uint256 _id) {
        require(
            _items[_id].manufacturer != address(0),
            "Product does not exist"
        );
        _;
    }

    function getProductsByOwner(
        address owner
    ) public view returns (Item[] memory) {
        uint256 productCount = 0;

        for (uint256 i = 0; i < _itemIds.length; i++) {
            if (_items[_itemIds[i]].currentOwner == owner) {
                productCount++;
            }
        }

        Item[] memory ownedProducts = new Item[](productCount);
        uint256 counter = 0;

        for (uint256 i = 0; i < _itemIds.length; i++) {
            if (_items[_itemIds[i]].currentOwner == owner) {
                ownedProducts[counter] = _items[_itemIds[i]];
                counter++;
            }
        }

        return ownedProducts;
    }

    function add(
        uint256 _id,
        string memory _title,
        RawProduct[] memory _rawProducts,
        string memory _material,
        string memory _status,
        string memory _tempStatus,
        string memory _longStatus,
        string memory _radioactivityLevel,
        string memory _dimensions
    ) public returns (bool) {
        address _manufacturer = msg.sender;
        require(
            _manufacturer != address(0),
            "Product::add: Manufacturer cannot be null"
        );
        _items[_id] = Item({
            id: _id,
            title: _title,
            manufacturer: _manufacturer,
            currentOwner: _manufacturer,
            lastOwner: address(0),
            launchDate: block.timestamp,
            material: _material,
            status: _status,
            tempStatus: _tempStatus,
            longStatus: _longStatus,
            radioactivityLevel: _radioactivityLevel,
            dimensions: _dimensions
        });
        for (uint i = 0; i < _rawProducts.length; i++) {
            _itemRawProducts[_id].push(_rawProducts[i]);
        }
        _itemIds.push(_id);
        return true;
    }

    function get(
        uint256 _id
    )
        public
        view
        returns (
            Item memory item,
            Transaction[] memory transactions,
            RawProduct[] memory rawProducts
        )
    {
        item = _items[_id];
        transactions = new Transaction[](_itemTransactions[_id].length);
        for (uint256 i = 0; i < _itemTransactions[_id].length; i++) {
            transactions[i] = _transactions[_itemTransactions[_id][i]];
        }
        rawProducts = _itemRawProducts[_id];
    }

    function transfer(address _to, uint256 _id) public returns (bool) {
        require(
            _items[_id].currentOwner != address(0),
            "Product::transfer: Product does not exist"
        );
        require(
            _items[_id].currentOwner != _to,
            "Product::transfer: Cannot transfer to self"
        );
        require(
            _to != address(0),
            "Product::transfer: Cannot transfer to null address"
        );

        _items[_id].lastOwner = _items[_id].currentOwner;
        _items[_id].currentOwner = _to;

        _transactions[_nextTransactionId] = Transaction({
            txId: _nextTransactionId,
            from: _items[_id].lastOwner,
            to: _items[_id].currentOwner,
            date: block.timestamp
        });
        _itemTransactions[_id].push(_nextTransactionId);
        _nextTransactionId++;
        return true;
    }

    function updateStatusTemporary(
        uint256 _id,
        string memory newStatus
    ) public itemExists(_id) returns (bool) {
        require(
            _items[_id].currentOwner == msg.sender,
            "Only the current owner can update the status"
        );
        require(bytes(newStatus).length > 0, "Status cannot be empty");

        _items[_id].tempStatus = newStatus;
        return true;
    }

    function updateStatusLongterm(
        uint256 _id,
        string memory neStatus
    ) public itemExists(_id) returns (bool) {
        require(
            _items[_id].currentOwner == msg.sender,
            "Only the current owner can update the status"
        );
        require(bytes(neStatus).length > 0, "Status cannot be empty");

        _items[_id].longStatus = neStatus;
        return true;
    }

    function getTransactionsByProductId(
        uint256 _productId
    ) public view returns (Transaction[] memory) {
        require(
            _items[_productId].manufacturer != address(0),
            "Product does not exist"
        );

        uint256 transactionCount = _itemTransactions[_productId].length;
        Transaction[] memory transactions = new Transaction[](transactionCount);

        for (uint256 i = 0; i < transactionCount; i++) {
            transactions[i] = _transactions[_itemTransactions[_productId][i]];
        }

        return transactions;
    }

    function getItemIds() public view returns (uint256[] memory) {
        return _itemIds;
    }

    function getProductsCount() public view returns (uint256) {
        return _itemIds.length;
    }

    function getTransactionsCount() public view returns (uint256) {
        return _nextTransactionId;
    }
}
