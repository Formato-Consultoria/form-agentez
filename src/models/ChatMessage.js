export class ChatMessageBox {
  constructor(
    id = '',
    sent = '',
    content = {
      imageSelf: '',
      attendantName: '',
      attendantPosition: '',
      companyName: '',
      companyCity: '',
    },
    user = {
      userEmail: '',
      userName: '',
    }
  ) {
    this.id = id;
    this.sent = sent;
    this.content = content;
    this.user = user;
  }
}