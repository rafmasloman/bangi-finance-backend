import prisma from '../../src/libs/prisma/orm.libs';
import bcrypt from 'bcrypt';

async function main() {
  const password = 'bangicafe';
  const hashPassword = await bcrypt.hash(password, 10);
  const director = await prisma.users.create({
    data: {
      email: 'bangicafe@gmail.com',
      password: hashPassword,
      username: 'bangisunset',
      firstname: 'Nizar',
      lastname: 'Sabri',
      role: 'DIRECTOR',
    },
  });

  return director;
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
