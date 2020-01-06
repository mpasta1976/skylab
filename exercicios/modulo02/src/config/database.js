module.exports = {
  dialect: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: 'docker',
  database: 'gobarber',
  define: {
    // cria automaticamente uma coluna de criado e atualizado em todos as tabelas do banco de dados
    timestamps: true,
    // cria as tabelas no formato blabla_blabla
    underscored: true,
    // cria as colunas no formato blabla_blabla
    underscoredAl: true,
  },
};
