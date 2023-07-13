export class ChatMessageBox {
  constructor(
    id = '',
    sent = '',
    content = {
      images: [],
      nameAgente: '',
      attendantName: '',
      attendantPosition: '',
      companyName: '',
      companyCity: '',
      companyCNPJ: ''
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