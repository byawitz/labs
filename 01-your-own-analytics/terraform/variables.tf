variable "hetzner_token" {
  sensitive = true
}

variable "cloudflare_token" {
  sensitive = true
}
variable "cloudflare_zone_name" {}

variable "ssh_key" {}

variable "server_size" {
  default = "cpx21"
}

variable "zone" {
  default = "us-east"
}

