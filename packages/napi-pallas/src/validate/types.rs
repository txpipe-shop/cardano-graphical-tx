#[napi(object)]
pub struct ValidationCheck {
  pub rule: String,
  pub passed: bool,
  pub error: Option<String>,
}

#[napi(object)]
pub struct ValidationResponse {
  pub era: String,
  pub checks: Vec<ValidationCheck>,
  pub valid: bool,
}
