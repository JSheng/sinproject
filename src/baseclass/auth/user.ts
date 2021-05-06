class User {
  private uuid!: string;
  private loginId!: string;
  private userName!: string;
  private isSuperAdmin!: boolean;

  public setUuid(uuid:string):void{
    this.uuid = uuid;
  }

  public getUuid():string{
    return this.uuid;
  }

  public setLoginId(loginId:string):void{
    this.loginId = loginId;
  }

  public getLoginId():string{
    return this.loginId;
  }

  public setUserName(userName:string):void{
    this.userName = userName;
  }

  public getUserName():string{
    return this.userName;
  }

  public setSuperAdmin(isSuperAdmin:boolean):void{
    this.isSuperAdmin = isSuperAdmin;
  }

  public gsetSuperAdmin():boolean{
    return this.isSuperAdmin;
  }
}

export default User;
