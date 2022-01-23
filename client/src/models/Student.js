export default class Student {
  constructor(rollNo, name, department, batch, groupId) {
    this.rollNo = rollNo;
    this.name = name;
    this.department = department;
    this.batch = batch;
    this.email = rollNo + "@uog.edu.pk";
    this.groupId = groupId;
  }

  setGroup(id) {
    this.groupId = id;
  }
}
