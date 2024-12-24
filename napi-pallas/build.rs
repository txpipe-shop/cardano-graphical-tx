extern crate napi_build;

fn main() {
  if cfg!(feature = "test-build") {
    println!("cargo:rustc-link-lib=dylib=node");
  }
  napi_build::setup();
}
