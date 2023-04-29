class MemoryDAO {
  constructor() {
    this.products = [];
  }

  addUser = async (userToAdd) => {
    this.products.push(userToAdd);

    return userToAdd;
  };

  getUsers = async () => this.products;

  clear = async () => (this.products = []);
}

export default MemoryDAO;
