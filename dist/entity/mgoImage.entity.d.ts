import { MgObject } from "./mgObject.entity";
export declare class MgoImage {
    imgId: string;
    mgId: string;
    imgName: string;
    imgUrl: string;
    s3Key: string;
    statusFlag: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
    userType: string;
    latitude: number;
    longitube: number;
    maskName: string;
    s3KeyMask: string;
    sailencyName: string;
    s3KeySailency: string;
    isDepthCamera: number;
    metaData: string;
    depthName: string;
    s3KeyDepth: string;
    confidenceName: string;
    s3KeyConfidence: string;
    userId: string;
    correctName: string;
    cropImgUrl: string;
    mgo: MgObject[];
}
