// Unit tests for FileStorage class

import UserStorage from "@/models/storage/fileStorage/user";
import User from "@/models/user";
import { mockInitialProgress } from "@/utils/mockData";
import { storageHelpers } from "@/utils/test_utils_storage";

describe("UserStorage class", function () {
	const storage = new UserStorage();

	const { createMockUser } = storageHelpers(storage)

	beforeEach(() => {
		createMockUser()
	})

	describe("newUser and getUser methods", function () {
		test("Adds a new user to storage", function () {
			const mockUser = storage.getUser("mockId");

			expect(mockUser).toBeDefined();
		});

		test("Adds a list of new users to storage", function () {
			const joe = new User("joe");
			const sam = new User("sam");
			storage.newUser([sam, joe]);

			const mockUserUser = storage.getUser("mockId");
			const joeUser = storage.getUser(joe.id);
			const samUser = storage.getUser(sam.id);

			expect(mockUserUser).toBeDefined();
			expect(joeUser).toBeDefined();
			expect(samUser).toBeDefined();
		});
	});

	describe("deleteUser method", function () {
		test("Deletes a user from storage", function () {
			const mockUser = storage.getUser("mockId") as User;

			expect(mockUser).toBeDefined();

			storage.deleteUser(mockUser.id);

			const deletedUser = storage.getUser("mockId");
			expect(deletedUser).toBeNull();
		});
	});

	describe("updateUserProgress and getUserStats methods", function () {
		test("Updates a user's progress on a round and retrieves a user's stats", function () {
			storage.updateUserProgress("mockId", mockInitialProgress, []);

			const mockUserStats = storage.getUserStats("mockId");

			expect(mockUserStats).toEqual(mockInitialProgress);
		});
	});

	describe("getTopTenUsers method", function () {
		test("Returns an Array of users sorted by correct answers", function () {
			const mockUser = storage.getUser("mockId") as User
			const joe = new User("joe");
			const mack = new User("mack");

			storage.newUser([joe, mack]);

			const testStat = {
				total: {
					answered: 15,
					correctAnswered: 10,
				},
			};
			const testStat2 = {
				total: {
					answered: 20,
					correctAnswered: 15,
				},
			};
			const testStat3 = {
				total: {
					answered: 12,
					correctAnswered: 8,
				},
			};

			mockUser.stats = testStat;
			joe.stats = testStat2;
			mack.stats = testStat3;

			const [joeStats, mockUserStats, mackStats] = storage.getTopTenUsers();

			expect(mockUserStats.username).toBe("mock user");
			expect(joeStats.username).toBe("joe");
			expect(mackStats.username).toBe("mack");
		});
	});
});
