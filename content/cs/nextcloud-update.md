---
title: Upgrade Nextcloud in Docker
date: 2024-06-01
---
So, here I am, hours after having started to upgrade Nextcloud. Seems easy, isn’t it ?
  
Well, it seemed easy at first, I do agree.

See **part** (\*) of the situation on [the github project](https://github.com/remigerme/remigerme.xyz) from commit `c6c775d` and onwards. 

---

# Pre-disaster situation

The first important thing to note is that you have to upgrade Nextcloud **one major version to the next one**, and only the next one. Starting from Nextcloud 25, I aimed to reach Nextcloud 29, so that’s 4 upgrades in a row.

(\*) : I worked directly on prod without committing in order to "gain" time.

My `docker-compose.yml` file looked like this :
  

```yaml
version: "3.7"

services:
  mariadb:
    image: mariadb:10
    ...

  nextcloud: 
    image: nextcloud:25
    ...
```
# Starting good…

Everything went well until Nextcloud 27 included (except I got a `version is obsolete` warning for some reason I didn't investigate at the time - turns out it was simply because `version: "x.y"` in docker compose file was deprecated), and then, upgrade to Nextcloud 28 as there was a statistics table to alter in the database. I didn’t want to get my hands dirty, then I told myself : time to upgrade MariaDB.
# … into somehow a mess…

What a terrible idea. Obviously it broke. Nextcloud couldn’t even connect to the database anymore. In fact, **MariaDB’s version (11) wasn’t supported**. But I didn’t realized that and I was working both in prod and in local, sometimes git pushing to prod. That’s were I really messed up, as I anticipated in local and pushed the docker compose file with `nextcloud:29` .

It tried to upgrade with Nextcloud 29. From there, when I was trying with Nextcloud 27 or 28, it said 29 was installed and I couldn’t downgrade. But when trying with 29, it said that 27 was installed and I couldn’t skip a major version. So I was kinda stuck.

Indeed, according to **`config.php`** , the server version was **27**. But according to **`version.php`** , it was now **29**. I **deleted the latter** - and at last realized that MariaDB’s version wasn’t supported, so went back to **`mariadb:10`**. Then, I faced various issues with tables definitions in the database, but all were solved by adding **`MARIADB_AUTO_UPGRADE=1`** .

# … unresolved mysteries left behind

  So I was back with a clean Nextcloud 27 installation. Everything was fine… **except I couldn’t see a single file in the web browser view**. I tried to scan files again, rebuild tree, repair… everything seemed useless.

  So eventually, I’d make up my mind and try to upgrade to Nextcloud 28. And it worked. Hurrah.

> [!note]- DLC : Collabora instance
> I then struggled with my collabora instance for a few minutes but it wasn’t nearly as messy.

# Solved using
  
```yaml
mariadb:
  image: mariadb:10
  ...
  environment:
    ...
    - "MARIADB_AUTO_UPGRADE=1"
```

> [!info] 
> **Delete `version.php`** when conflicting with **`config.php` .**

> [!info]
> Using **`php occ maintenance:repair`** and **`php occ files:scan --all`** a lot.

Good luck with your upgrade.
# References

- [Nextcloud system requirements](https://docs.nextcloud.com/server/latest/admin_manual/installation/system_requirements.html#server)
- [Github issue about broken tables](https://github.com/wallabag/wallabag/issues/6572)
- [Can’t start Nextcloud because the version of the data is higher than the docker image version and downgrading is not supported](https://help.nextcloud.com/t/cant-start-nextcloud-because-the-version-of-the-data-is-higher-than-the-docker-image-version-and-downgrading-is-not-supported/109438)
- [Nextcloud commands](https://docs.nextcloud.com/server/latest/admin_manual/configuration_server/occ_command.html)
