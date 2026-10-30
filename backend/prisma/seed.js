// Test data for local development: run with "npx prisma db seed"
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Every test account has this password
const PASSWORD = 'password123';

async function main() {
  const passwordHash = await bcrypt.hash(PASSWORD, 10);

  const user = (email, firstName, lastName, role, trainerId = null) =>
    prisma.user.upsert({
      where: { email },
      update: {},
      create: { email, firstName, lastName, role, trainerId, passwordHash },
    });

  const admin = await user('admin@reptrack.test', 'Maja', 'Horvat', 'Admin');
  const ana = await user('ana@reptrack.test', 'Ana', 'Kovač', 'Trainer');
  const luka = await user('luka@reptrack.test', 'Luka', 'Zupan', 'Trainer');

  await user('marko@reptrack.test', 'Marko', 'Novak', 'Client', ana.id);
  await user('eva@reptrack.test', 'Eva', 'Kos', 'Client', ana.id);
  await user('nina@reptrack.test', 'Nina', 'Krajnc', 'Client', luka.id);

  const exercises = [
    ['Bench press', 'Chest', 'Lie on a bench and press the barbell up from the chest.'],
    ['Push-up', 'Chest', 'Bodyweight press from the floor.'],
    ['Barbell row', 'Back', 'Bent over, pull the barbell to the lower chest.'],
    ['Pull-up', 'Back', 'Pull the body up until the chin is over the bar.'],
    ['Squat', 'Legs', 'Barbell on the upper back, squat down and stand up.'],
    ['Romanian deadlift', 'Legs', 'Hinge at the hips with slightly bent knees.'],
    ['Overhead press', 'Shoulders', 'Press the barbell from the shoulders overhead.'],
    ['Lateral raise', 'Shoulders', 'Raise the dumbbells to the sides up to shoulder height.'],
    ['Biceps curl', 'Arms', 'Curl the dumbbells up while keeping the elbows still.'],
    ['Triceps dip', 'Arms', 'Lower and raise the body between parallel bars.'],
    ['Plank', 'Core', 'Hold the body straight, supported on forearms and toes.'],
  ];

  for (const [name, muscleGroup, description] of exercises) {
    await prisma.exercise.upsert({
      where: { name },
      update: {},
      create: { name, muscleGroup, description, createdById: admin.id },
    });
  }

  console.log(`Seed done. Test accounts use the password "${PASSWORD}".`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
