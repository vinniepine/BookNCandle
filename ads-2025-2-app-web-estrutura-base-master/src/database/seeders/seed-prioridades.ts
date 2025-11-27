import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { Prioridade } from '../../modules/prioridade/prioridade.entity';

async function seedPrioridades() {
  const dataSource = new DataSource({
    type: 'mysql',
    host: 'localhost',
    port: 3309,
    username: 'root',
    password: 'root',
    database: 'web',
    entities: [Prioridade],
    synchronize: false,
    logging: false,
    namingStrategy: new SnakeNamingStrategy(),
  });

  try {
    await dataSource.initialize();

    const repo = dataSource.getRepository(Prioridade);

    const nomes = ['Baixa', 'Média', 'Alta', 'Crítica'];

    for (const nome of nomes) {
      const exists = await repo.findOne({ where: { nome } });
      if (!exists) {
        const nova = repo.create({ nome });
        await repo.save(nova);
        console.log(`Inserida prioridade: ${nome}`);
      } else {
        console.log(`Prioridade já existe: ${nome}`);
      }
    }

    console.log('Seed de prioridades finalizado.');
  } catch (err) {
    console.error('Erro ao rodar seed de prioridades:', err);
    // process.exitCode = 1;
  } finally {
    if (dataSource.isInitialized) await dataSource.destroy();
  }
}

seedPrioridades();
