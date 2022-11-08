export const AUTH_EXCEPTION = {
  AUTH_CODE_EXPIRED: {
    code: "AUTH_CODE_EXPIRED",
    message: "Expired authentication code",
  },
  AUTH_CODE_INVALID: {
    code: "AUTH_CODE_INVALID",
    message: "Invalid authentication code",
  },
  AUTH_FAIL_VALIDATE: {
    code: "AUTH_FAIL_VALIDATE",
    message: "아이디/비밀번호가 일치하지 않습니다",
  },
};

export const USER_EXCEPTION = {
  USER_NOT_FOUND: {
    code: "USER_NOT_FOUND",
    message: "존재하는 유저가 없습니다.",
  },
  USER_EXIST: {
    code: "USER_EXIST",
    message: "이미 존재하는 유저입니다.",
  },
};

export const ROLE_EXCEPTION = {
  ROLE_NOT_FOUND: {
    code: "ROLE_NOT_FOUND",
    message: "역할을 찾을 수 없습니다.",
  },
  ROLE_EXIST: {
    code: "ROLE_EXIST",
    message: "이미 존재하는 역할입니다.",
  },
};

export const CONNECT_LOG_EXCEPTION = {
  CONNECT_LOG_NOT_FOUND: {
    code: "CONNECT_LOG_NOT_FOUND",
    message: "유저의 접속 로그를 찾을 수 없습니다.",
  },
};

export const MGOBJECT_EXCEPTION = {
  MGOBJECT_NOT_FOUND: {
    code: "MGOBJECT_NOT_FOUND",
    message: "mgobject를 찾을 수 없습니다.",
  },
};

export const MGOIMAGE_EXCEPTION = {
  MGOIMAGE_NOT_FOUND: {
    code: "MGOIMAGE_NOT_FOUND",
    message: "MGOIMAGE를 찾을 수 없습니다.",
  },
};
