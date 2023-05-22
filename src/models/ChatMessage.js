export class ChatMessageBox {
  constructor(
    id = '',
    sent = '',
    content = {
      imageSelf: '',
      attendantName: '',
      attendantPosition: '',
      companyName: ''
    },
    user = {
      phoneNumber: '',
      userName: '',
      userId: '',
    }
  ) {
    this.id = id;
    this.sent = sent;
    this.content = content;
    this.user = user;
  }
}