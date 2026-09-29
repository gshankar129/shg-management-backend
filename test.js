// import prisma from "./src/config/db.js";

// async function main() {
//   await prisma.$connect();

//   console.log("Database Connected");

//   const users = await prisma.user.findMany();

//   console.log(users);

//   await prisma.$disconnect();
// }

// main().catch(console.error);

//-------------------------------------------------------


import prisma from "./src/config/db.js";

// async function main() {
//   const user = await prisma.user.create({
//     data: {
//       name: "Gauri Shankar",
//       email: "gauri@example.com",
//       password:"G@uri123"
//     },
//   });

//   console.log(user);
// }

// main()
//   .catch(console.error)
//   .finally(async () => {
//     await prisma.$disconnect();
//   });



async function main() {
  const users = await prisma.user.findMany();

  console.log(users);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });