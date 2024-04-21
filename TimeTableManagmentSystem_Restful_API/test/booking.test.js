const {
    createBooking,
    getaBooking,
    getallBooking,
    updateBooking,
    deleteBooking
  } = require("../controller/bookingCtrl");
  const Booking = require("../models/bookingModel");
  const asyncHandler = require("express-async-handler");

   
    jest.mock("../models/bookingModel");

    describe("Booking Controller", () => {

        afterEach(() => {
            jest.clearAllMocks();
        });
        
        describe("add new Booking ", () => {
            it("should create a new booking", async () => {
            const mockBookingData = {
                roomId: "65fc0709ee833a7a362e768e",
                resourceId: "65fc0709ee833a7a362e768e",
                dayOfWeek: "Monday",
                startTime: "10:00",
                endTime: "12:00",
            };
        
            const req = { body: { mockBookingData } };
            const res = { json: jest.fn() };
        
            Booking.create.mockResolvedValue(req.body);
            await createBooking(req, res);
        
            expect(Booking.create).toHaveBeenCalledWith(req.body);
        
            expect(res.json).toHaveBeenCalledWith(req.body);
            });
        });
        
        describe("get a Booking", () => {
            it("should get a booking by id", async () => {
            const mockBooking = {
                roomId: "65fc0709ee833a7a362e768e",
                resourceId: "65fc0709ee833a7a362e768e",
                dayOfWeek: "Monday",
                startTime: "10:00",
                endTime: "12:00",
            };
        
            const req = { params: { id: "65fc0709ee833a7a362e768e" } };
            const res = { json: jest.fn() };
        
            Booking.findById.mockResolvedValue(mockBooking);
        
            await getaBooking(req, res);
        
            expect(Booking.findById).toHaveBeenCalledWith(req.params.id);
            expect(res.json).toHaveBeenCalledWith(mockBooking);
            });
        });
        
        describe("get all Booking", () => {
            it("should get all the booking", async () => {
            const mockBooking = [
                {
                roomId: "65fc0709ee833a7a362e768e",
                resourceId: "65fc0709ee833a7a362e768e",
                dayOfWeek: "Monday",
                startTime: "10:00",
                endTime: "12:00",
                },
                {
                    roomId: "65fc0709ee833a7a362e768e",
                    resourceId: "65fc0709ee833a7a362e768e",
                    dayOfWeek: "Monday",
                    startTime: "10:00",
                    endTime: "12:00"
                },
            ];

            const req = {};
            const res = { json: jest.fn() };

            Booking.find.mockResolvedValue(mockBooking);

            await getallBooking(req, res);

            expect(Booking.find).toHaveBeenCalled();

            expect(res.json).toHaveBeenCalledWith(mockBooking);
            });

        });

    });