import { prisma } from "./lib/prisma";
import bcrypt from "bcryptjs";

async function testLogin() {
  console.log("Testing login for admin@kubiceng.com...");

  try {
    const user = await prisma.user.findUnique({
      where: { email: "admin@kubiceng.com" },
      include: { subscription: true },
    });

    if (!user) {
      console.error("❌ User not found in database!");
      return;
    }

    console.log("✅ User found:", user.email, "Role:", user.role);
    console.log("Stored Hash:", user.passwordHash);

    const isMatch = await bcrypt.compare("admin123", user.passwordHash);

    if (isMatch) {
      console.log('✅ Password "admin123" is CORRECT!');
    } else {
      console.error('❌ Password "admin123" is INCORRECT!');
      // Try to re-hash to see what it should be
      const newHash = await bcrypt.hash("admin123", 10);
      console.log('Expected hash for "admin123" would look like:', newHash);
    }
  } catch (error) {
    console.error("❌ Error during test:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testLogin();
