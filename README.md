# Menu-Online

# Progetto
Ogni attività ristorativa ha a disposizione un proprio menù, sottoforma di link, di cui una parte di quest'ultimo personalizzabile alla registrazione.
Una volta effettuata la registrazione e verificato l'account è possibile inserire le informazioni della propria attività.
E' possibile mettere più categorie e per ogni categoria i piatti con il prezzo e la descrizione.
E' anche possibile inserire la propria via, la mappa, gli orari di apertura e il proprio numero di telefono.


# Installazione
Per installare il progetto, dopo averlo scaricato, è necessario modificare il file di configurazione .ENV e inserire i propri parametri come segue:\n
TOKEN_SECRET: token che firma i JWT \n
PORT: porta di funzionamento tcp \n
MONGO_DB: link di collegamento al database mongodb \n
RECAPTCHA_PRIVATE_KEY: chiave privata di recaptcha fornita da Google \n
RECAPTCHA_PUBLIC_KEY: chiave pubblica di recaptcha fornita da Google \n

Una volta inseriti i parametri nel file di configurazione il progetto è quasi pronto per essere avviato.
Installa tutte le dipendenze:
├── bcrypt@5.1.0
├── body-parser@1.20.1
├── cookie-parser@1.4.6
├── crypto@1.0.1
├── dotenv@16.0.3
├── ejs@3.1.8
├── express@4.18.2
├── fs@0.0.1-security
├── jsonwebtoken@8.5.1
├── mongoose@6.7.2
├── multer@1.4.5-lts.1
├── mysql@2.18.1
├── nodemon@2.0.20
├── randomstring@1.2.3
├── sharp@0.31.2
├── sitemap@7.1.1
└── uuid@9.0.0
