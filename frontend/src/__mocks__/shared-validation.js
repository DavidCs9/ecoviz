// Mock for shared validation schema
export const CalculateRequestSchema = {
  safeParse: jest.fn().mockReturnValue({
    success: true,
    data: {
      userId: "test-user",
      data: {
        housing: {},
        transportation: {},
        food: {},
        consumption: {}
      }
    }
  })
};