const ShoppingListService = require('../src/shopping-list-service');
const knex = require('knex');

describe('Shopping list service object', function() {
  let db;

  let testShoppingList = [
    {
      id: 1,
      name:'Fish tricks', 
      price: '13.10', 
      category: 'Main',
      checked: true,
      date_added: new Date('2020-03-31T16:28:32.615Z')
    },
    {
      id: 2,
      name: 'Not Dogs', 
      price: '4.99', 
      category: 'Snack',
      checked: false,
      date_added: new Date('2020-03-30T16:28:32.615Z')
    },
    {
      id: 3,
      name: 'Bluffalo Wings', 
      price: '5.50', 
      category: 'Snack',
      checked: false,
      date_added: new Date('2020-03-31T16:28:32.615Z')
    },
  ];

  before(() => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    });
  });

  before(() => db('shopping_list').truncate());

  afterEach(() => db('shopping_list').truncate());

  after(() => db.destroy());

  // describe('getAllShoppingList()', () => {
  context(`Given 'shopping_list' has data`, () => {
    beforeEach(() => {
      return db
        .into('shopping_list')
        .insert(testShoppingList);
    });

    it(`getItemById() resolves an item by id from 'shopping_list' table`, () => {
      const thirdId = 3;
      const thirdTestShoppingItem = testShoppingList[thirdId - 1];
      return ShoppingListService.getItemById(db, thirdId)
        .then(actual => {
          expect(actual).to.eql({
            id: thirdId,
            name: thirdTestShoppingItem.name,
            price: thirdTestShoppingItem.price,
            date_added: thirdTestShoppingItem.date_added,
            category: thirdTestShoppingItem.category,
            checked: thirdTestShoppingItem.checked,
          });
        });
    });

    it(`deleteShoppingItem() removes an item by id from 'shopping_list' table`, () => {
      const itemId = 3;
      return ShoppingListService.deleteShoppingItem(db, itemId)
        .then(() => ShoppingListService.getAllShoppingList(db))
        .then(allItems => {
          const expected = testShoppingList.filter(item => item.id !== itemId);
          expect(allItems).to.eql(expected);
        });
    });

    it(`updateShoppingItem() updates an item from the 'shopping_list' table`, () => {
      const idOfItemToUpdate = 3;
      const newItemData = {
        name: 'updated name',
        price: '10.10',
        date_added: new Date(),
        category: 'Lunch',
        checked: false,
      }
      return ShoppingListService.updateShoppingItem(db, idOfItemToUpdate, newItemData)
        .then(() => ShoppingListService.getItemById(db, idOfItemToUpdate))
        .then(item => {
          expect(item).to.eql({
            id: idOfItemToUpdate,
            ...newItemData,
          });
        });
    });

  it(`getAllShoppingList() resolves all shopping items from 'shopping_list' table`,
      () => {
      // test that ArticlesService.getAllArticles gets data from table
        return ShoppingListService.getAllShoppingList(db)
          .then(actual => {
            expect(actual).to.eql(testShoppingList);
          });
      });
  });

  context(`Given 'shopping_list' has no data`, () => {
    it(`getAllShoppingList() resolves an empty array`, () => {
      return ShoppingListService.getAllShoppingList(db)
        .then(actual => {
          expect(actual).to.eql([]);
        });
    });
    it(`insertShoppingItem() inserts a new item and resolves the new item with an 'id'`, () => {
      const newShoppingItem = {
        name:'Fish tricks', 
        price: '13.10', 
        category: 'Main',
        checked: true,
        date_added: new Date('2020-03-31T16:28:32.615Z')
      };
      return ShoppingListService.insertShoppingItem(db, newShoppingItem)
        .then(actual => {
          expect(actual).to.eql({
            id: 1,
            name: newShoppingItem.name,
            price: newShoppingItem.price,
            category: newShoppingItem.category,
            checked: newShoppingItem.checked,
            date_added: newShoppingItem.date_added
          });
        });
    });
  });
});