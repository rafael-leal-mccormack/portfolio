export function createZone(map, layer, objName, action) {
    const area = map.findObject(
        layer,
        (obj) => obj.name === objName
    );

    console.log(area)
    if (area) {
        const zone = this.add.zone(
            area.x + area.width / 2,
            area.y + area.height / 2,
            area.width,
            area.height
        );

        this.physics.world.enable(zone);
        zone.body.debugShowBody = false;
        this.physics.add.overlap(
            this.player.getPlayer(),
            zone,
            action
        );
        return zone;
    }

    return null;

  }
