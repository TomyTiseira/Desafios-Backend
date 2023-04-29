import chai from "chai";
import { dbDAO } from "../config/connectToDb";

const expect = chai.expect;

describe("Products controller", () => {
  describe("getProducts", () => {
    beforeEach(async () => {
      await dbDAO.clear();
    });
  });
});
