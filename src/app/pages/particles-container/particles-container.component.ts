import {AfterViewInit, Component, ElementRef, Renderer2, ViewChild} from '@angular/core';
import {ClickMode, HoverMode, ISourceOptions, MoveDirection, OutMode} from "tsparticles-engine";
import {loadFull} from "tsparticles";
import {NgParticlesComponent} from "ng-particles/lib/ng-particles.component";

@Component({
  selector: 'app-particles-container',
  templateUrl: './particles-container.component.html',
  styleUrls: ['./particles-container.component.scss']
})
export class ParticlesContainerComponent{



  public title = 'space';
  public id = 'particles';
  public options: ISourceOptions = {
    // background: {
    //   color: {
    //     value: "#000000"
    //   }
    // },
    fullScreen: false,

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
  constructor(private _renderer: Renderer2) { }

  particlesInit = async (engine: any): Promise<void> => {
    await loadFull(engine);
  };
}
