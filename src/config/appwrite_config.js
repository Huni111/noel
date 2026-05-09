import { Client, Storage } from 'appwrite';

const client = new Client();

client
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('69fb57260028db60c6ee');

export const storage = new Storage(client);

export default client;
