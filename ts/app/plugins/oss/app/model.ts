import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: "image" })
export class Image extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: "smallint",
    default: 1,
    comment: "1 表示来自oss，2 表示来自本地"
  })
  from!: string;

  @Column({ type: "varchar", length: 255, nullable: true, comment: "图片url" })
  url!: string;
}
