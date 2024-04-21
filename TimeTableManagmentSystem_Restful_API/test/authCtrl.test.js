const {
  createUser,
  getallUser,
  getaUser,
  deleteaUser,
} = require("../controller/userCtrl");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");

jest.mock("../models/userModel");

describe("User Controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("add new User ", () => {
    it("should create a new user", async () => {
      const mockUserData = {
        firstName: "John",
        lastName: "Doe",
        email: "dilshan@gmail.com",
        mobile: "0712345678",
        password: "123456",
        role: "Admin",
      };

      const req = { body: { mockUserData } };
      const res = { json: jest.fn() };

      User.create.mockResolvedValue(req.body);
      await createUser(req, res);

      expect(User.create).toHaveBeenCalledWith(req.body);

      expect(res.json).toHaveBeenCalledWith(req.body);
    });
  });

  describe("get a User", () => {
    it("should get a user by id", async () => {
      const mockUserData = {
        firstName: "John",
        lastName: "Doe",
        email: "dilshan@gmail.com",
        mobile: "0712345678",
        password: "123456",
        role: "Admin",
      };

      const req = { params: { id: "65fb1ea95104104e21fc4874" } };
      const res = { json: jest.fn() };

      User.findById.mockResolvedValue(mockUserData);

      await getaUser(req, res);

      expect(User.findById).toHaveBeenCalledWith(req.params.id);

      expect(res.json).toHaveBeenCalledWith(mockUserData);
    });
  });

  describe("get all Users", () => {
    it("should get all users", async () => {
      const mockUserData = {
        firstName: "John",
        lastName: "Doe",
        email: "dilshan@gmail.com",
        mobile: "0712345678",
        password: "123456",
        role: "Admin",
      };

      const req = {};
      const res = { json: jest.fn() };

      User.find.mockResolvedValue(mockUserData);
      await getallUser(req, res);

      expect(User.find).toHaveBeenCalledWith();

      expect(res.json).toHaveBeenCalledWith(mockUserData);
    });
  });

  describe("delete a User", () => {
    it("should delete a user by id", async () => {
      const mockUserData = {
        firstName: "John",
        lastName: "Doe",
        email: "dilshan@gmail.com",
        mobile: "0712345678",
        password: "123456",
        role: "Admin",
      };

      const req = { params: { id: "65fb1ea95104104e21fc4874" } };
      const res = { json: jest.fn() };

      User.findByIdAndDelete.mockResolvedValue(mockUserData);

      await deleteaUser(req, res);

      expect(User.findByIdAndDelete).toHaveBeenCalledWith(req.params.id);

      expect(res.json).toHaveBeenCalledWith(mockUserData);
    });
  });
});
