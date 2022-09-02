import { MgoImage } from "./mgoImage.entity";
export declare class MgObject {
    mgId: string;
    mgGroupId: string;
    mgName: string | null;
    statusFlag: number | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    deletedAt: Date | null;
    mgCategory: string | null;
    likeCnt: bigint | null;
    likeRank: number | null;
    rankChange: number | null;
    mgoImages: MgoImage[];
}
