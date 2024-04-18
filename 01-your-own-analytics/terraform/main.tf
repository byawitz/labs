data "hcloud_ssh_key" "ssh_key" {
  name = var.ssh_key
}


resource "hcloud_server" "analytics" {
  name        = "analytics"
  server_type = var.server_size
  image       = "ubuntu-22.04"
  location    = var.zone
  ssh_keys    = [data.hcloud_ssh_key.ssh_key.id]
  backups     = true

  labels = { "analytics" : "self-hosted" }

  public_net {
    ipv4_enabled = true
    ipv6_enabled = false
  }
}

resource "null_resource" "installing-analytics" {
  connection {
    type        = "ssh"
    user        = "root"
    host        = hcloud_server.analytics.ipv4_address
    private_key = file("~/.ssh/id_rsa")
  }

  provisioner "remote-exec" {
    inline = [
      "mkdir -p /root/analytics/docker"
    ]
  }

  provisioner "file" {
    source      = "../docker"
    destination = "/root/analytics/"
  }

  provisioner "file" {
    source      = "../justfile"
    destination = "/root/analytics/justfile"
  }

  provisioner "remote-exec" {
    inline = [
      "apt update",
      "fallocate -l 4G /swapfile",
      "chmod 600 /swapfile",
      "mkswap /swapfile",
      "swapon /swapfile",
      "swapon --show",
      "echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab",
      "curl -fsSL https://get.docker.com | sh",
      "cd /root/analytics",
      "curl --proto '=https' --tlsv1.2 -sSf https://just.systems/install.sh | bash -s -- --to /root/analytics",
      "export PATH=\"$PATH:/root/analytics\"",
      "just change-domain-analytics analytics.${var.cloudflare_zone_name}",
      "just change-domain-dashboard dashboard.${var.cloudflare_zone_name}",
      "just install-prod",
    ]
  }
}

data "cloudflare_zone" "zone" {
  name = var.cloudflare_zone_name
}

resource "cloudflare_record" "analytics-sub-domain" {
  zone_id = data.cloudflare_zone.zone.zone_id
  name    = "analytics"
  value   = hcloud_server.analytics.ipv4_address
  proxied = true
  type    = "A"
  ttl     = 1
}

resource "cloudflare_record" "dashboard-sub-domain" {
  zone_id = data.cloudflare_zone.zone.zone_id
  name    = "dashboard"
  value   = hcloud_server.analytics.ipv4_address
  proxied = true
  type    = "A"
  ttl     = 1
}

output "domain" {
  value = "Access dashbaord at ${cloudflare_record.dashboard-sub-domain.hostname}\nSend analytics to ${cloudflare_record.analytics-sub-domain.hostname}"
}