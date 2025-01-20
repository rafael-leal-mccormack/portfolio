import { Scene } from 'phaser';

export class Preloader extends Scene
{
    constructor ()
    {
        super('Preloader');
    }

    init ()
    {
        //  We loaded this image in our Boot Scene, so we can display it here
        const image = this.add.image(300, 200, 'background');
        image.setScale(0.5);

        // music
        // menu -forlorn homestead
        // base map - sea shanty
        // home map - fishing
        // projects map - flute salad
        // work map - trade parade

        //  A simple progress bar. This is the outline of the bar.
        this.add.rectangle(this.renderer.width / 2, this.renderer.height / 2, 468, 32).setStrokeStyle(1, 0xffffff);

        //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        const bar = this.add.rectangle((this.renderer.width / 2) - 230, this.renderer.height / 2, 4, 28, 0xffffff);

        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        this.load.on('progress', (progress) => {

            //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
            bar.width = 4 + (460 * progress);
        });
    }

    preload ()
    {
        //  Load the assets for the game - Replace with your own assets
        this.load.setPath('assets');

        this.load.image("tiles", "tileset/tuxmon-sample-32px.png");
        this.load.image("interiorTiles", "tileset/interiors.png");

        this.load.tilemapTiledJSON("map", "tilemap/portfolio_map.json");
        this.load.tilemapTiledJSON("homeMap", "tilemap/home_map.json");
        this.load.tilemapTiledJSON("workMap", "tilemap/work_interior.json");
        this.load.tilemapTiledJSON("projectsMap", "tilemap/projects_map.json");

        this.load.spritesheet('dude', 
            'people/boy.png',
            { frameWidth: 64, frameHeight: 64 }
        );

        this.load.spritesheet('bg', 
            'backgrounds/spritesheet.png',
            { frameWidth: 875, frameHeight: 658 }
        );

        this.load.spritesheet("olaf", 
            'pets/olaf-OW.png',
            { frameWidth: 32, frameHeight: 32 }
        );

        this.load.spritesheet("neptune", 
            'pets/neptune-OW.png',
            { frameWidth: 64, frameHeight: 64 }
        );


        this.load.spritesheet("asmodeus", 
            'pets/asmodeus-OW.png',
            { frameWidth: 64, frameHeight: 64 }
        );

        this.load.image("raf", "people/raf.png");
        this.load.image("pets", "pets/together.png");

        this.load.image('logo', 'logo.png');

        this.load.audio("menu-music", "sounds/The_Forlorn_Homestead.mp3");
        this.load.audio("base-map", "sounds/Sea_Shanty_2.mp3");

        this.load.image("ukgIcon", "work/Ukg_Logo.png");
        this.load.image("nbaIcon", "work/Nba_Logo.png");
        this.load.image("mentrIcon", "work/Mentr_Logo.png");
        this.load.image("airclawIcon", "work/Airclaw_Logo.png");
    }

    create ()
    {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.

        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
        this.scene.start('MainMenu');
    }
}
