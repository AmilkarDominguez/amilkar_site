import { Component, OnInit } from '@angular/core';
import { MoveDirection, ClickMode, HoverMode, OutMode, Engine, ISourceOptions } from "tsparticles-engine";
import { loadFull } from "tsparticles";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  title = 'CodeSandbox';
  id = 'tsparticles';
  options: ISourceOptions = {
    background: {
      color: {
        value: "#000000"
      }
    },
    fpsLimit: 120,
    interactivity: {
      events: {
        onClick: {
          enable: true,
          mode: ClickMode.push
        },
        onHover: {
          enable: true,
          mode: HoverMode.repulse
        },
        resize: true
      },
      modes: {
        push: {
          quantity: 4
        },
        repulse: {
          distance: 200,
          duration: 0.4
        }
      }
    },
    particles: {
      color: {
        value: "#ffffff"
      },
      links: {
        color: "#ffffff",
        distance: 150,
        enable: true,
        opacity: 0.5,
        width: 0.2
      },
      collisions: {
        enable: true
      },
      move: {
        direction: MoveDirection.none,
        enable: true,
        outModes: {
          default: OutMode.bounce
        },
        random: false,
        speed: 0.2,
        straight: false
      },
      number: {
        density: {
          enable: true,
          area: 800
        },
        value: 80
      },
      opacity: {
        value: 0.5
      },
      shape: {
        type: "circle"
      },
      size: {
        value: {min: 0.5, max: 3 },
      }
    },
    detectRetina: true
  };




  options2: ISourceOptions = {
    particles: {

      size: {
        value: {min: 0.1, max: 2 },
      },
      autoPlay: true,
      color: {
        value: ['#FFFFFF']
      },
      move: {
        attract: {
          enable: false,
          rotate: {
            x: 500,
            y: 500
          }
        },
        bounce: false,
        direction: MoveDirection.none,
        enable: true,
        outMode: OutMode.bounceHorizontal,
        random: true,
        speed: 0.2,
        straight: true
      },
      links: {
        color: {
          value: "#ffffff"
        },
        distance: 20,
        enable: true,
        frequency: 1,
        opacity: 0.4,
      }
    },
    polygon: {
      enable: true,
      inline: {
        arrangement: 'one-per-point'
      },
      move: {
        radius: 3.5
      },
      inlineArrangement: "equidistant",
      scale: 1,
      type: 'inline',
      url: 'assets/svg/amilkar_logo_site.svg'
      //url:'https://particles.js.org/images/smalldeer.svg'
    },
    interactivity: {
      detectsOn: "canvas",
      events: {
        onHover: {
          enable: true,
          mode: "bubble",
        }
      },
      modes: {
        bubble: {
          color: "#00FFFF",
          distance: 100,
          duration: 2,
          opacity: 0.5,
          size: 0.1,
          speed: 3
        },
      }
    },
    background: {
      //color: "#000000",
      //image: "",
      //position: "50% 50%",
      //repeat: "repeat",
      //size: "cover"
    },
    detectRetina: false,
    duration: 0,
    fpsLimit: 60,
  };

  particlesInit = async (engine: any): Promise<void> => {
    await loadFull(engine);
  };

}
