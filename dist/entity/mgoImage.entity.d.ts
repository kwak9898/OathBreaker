import { MgObject } from "./mgObject.entity";
export declare class MgoImage {
    imgId: string | null;
    mgId: string | null;
    imgName: string | null;
    imgUrl: string | null;
    s3Key: string | null;
    statusFlag: number | null;
    createdAt: string | null;
    updatedAt: string | null;
    deletedAt: string | null;
    userType: string | null;
    latitude: number | null;
    longitube: number | null;
    maskName: string | null;
    s3KeyMask: string | null;
    sailencyName: string | null;
    s3KeySailency: string | null;
    isDepthCamera: number | null;
    metaData: string | null;
    depthName: string | null;
    s3KeyDepth: string | null;
    confidenceName: string | null;
    s3KeyConfidence: string | null;
    userId: string | null;
    correctName: string | null;
    cropImgUrl: string | null;
    mgo: MgObject[];
}
