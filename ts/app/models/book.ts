import { InfoCrud as Base } from "lin-cms-test";
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("book")
export class Book extends Base {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 50, nullable: false })
  title!: string;

  @Column({ length: 30, nullable: true, default: "未名" })
  author!: string;

  @Column({ length: 1000, nullable: true })
  summary!: string;

  @Column({ length: 100, nullable: true })
  image!: string;

  public toJSON() {
    let origin = {
      id: this.id,
      title: this.title,
      author: this.author,
      summary: this.summary,
      image: this.image,
      create_time: this.createTime
    };
    return origin;
  }
}
