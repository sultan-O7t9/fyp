export default class Group {
  constructor(id, leader, members, supervisor, projectTitle, description) {
    this.id = id;
    this.leader = leader;
    this.members = members;
    this.supervisor = supervisor;
    this.projectTitle = projectTitle;
    this.description = description;
  }
}
