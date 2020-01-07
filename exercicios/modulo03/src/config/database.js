require('dotenv').config();

module.exports = {
  dialect: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: 'bootcamppostgres',
  database: 'postgres',
  define: {
    // cria automaticamente uma coluna de criado e atualizado em todos as tabelas do banco de dados
    timestamps: true,
    // cria as tabelas no formato blabla_blabla
    underscored: true,
    // cria as colunas no formato blabla_blabla
    underscoredAl: true,
  },
};
