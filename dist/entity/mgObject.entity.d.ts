import { MgoImage } from "./mgoImage.entity";
export declare class MgObject {
    mgId: string;
    mgGroupId: string;
    mgName: string;
    statusFlag: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
    mgCategory: string;
    likeCnt: bigint;
    likeRank: number;
    rankChange: number;
    mgoImages: MgoImage[];
}
