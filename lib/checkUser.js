import { currentUser } from "@clerk/nextjs/server";
import { db } from "./prisma";

export const checkUser = async () => {
  try {
    const user = await currentUser();

    if (!user) {
      console.log("No user found in currentUser()");
      return null;
    }

    // Attempt to find the user in the database by clerkUserId
    const loggedInUser = await db.user.findUnique({
      where: {
        clerkUserId: user.id,
      },
    });

    // If the user is found, return it
    if (loggedInUser) {
      return loggedInUser;
    }

    // If no user is found, create a new user entry in the database
    const name = `${user.firstName} ${user.lastName}`;
    const newUser = await db.user.create({
      data: {
        clerkUserId: user.id,
        name,
        imageUrl: user.imageUrl,
        emailUrl: user.emailAddresses[0]?.emailAddress || '', // Optional chaining for safety
      },
    });

    return newUser;
  } catch (error) {
    // Log the error message with stack trace for better debugging
    console.error("Error in checkUser:", error.message);
    console.error(error.stack);
    return null;
  }
};
