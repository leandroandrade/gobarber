class PrintValue {

    get key() {
        return 'PrintValue';
    }

    async handle({ data }) {
        console.log('acessando job PrintValue...');
    }
}

export default new PrintValue();