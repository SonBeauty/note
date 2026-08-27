/** Lỗi có mã HTTP xác định, để handler dịch thẳng ra response. */
export class HttpError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "HttpError";
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message = "Chưa đăng nhập") {
    super(401, message);
  }
}

/**
 * Dùng cho CẢ hai trường hợp: không tồn tại, và không thuộc về người dùng hiện tại.
 * Trả 404 thay vì 403 để không lộ ra rằng tài nguyên đó có tồn tại.
 */
export class NotFoundError extends HttpError {
  constructor(message = "Không tìm thấy") {
    super(404, message);
  }
}

export class ConflictError extends HttpError {
  constructor(message = "Dữ liệu đã bị thay đổi ở nơi khác") {
    super(409, message);
  }
}

export class BadRequestError extends HttpError {
  constructor(message = "Dữ liệu không hợp lệ") {
    super(400, message);
  }
}
