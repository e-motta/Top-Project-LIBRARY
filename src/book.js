export default function Book(title, author, pages, read, account, timestamp) {
  read = read ? true : false;
  return { title, author, pages, read, account, timestamp };
}
