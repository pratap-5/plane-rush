const strikenuber=document.getElementById('strikeNumber')
const planeHealth=document.getElementById('planeHealth')
const currentLevel=document.getElementById('currentLevel')
const restStrikeToNext=document.getElementById('restStrikeToNext')

const hints1=document.getElementById('hints1');
const hints2=document.getElementById('hints2');
const hints3=document.getElementById('hints3');
const hints4=document.getElementById('hints4');
const button1=document.getElementById('btn1');
const button2=document.getElementById('btn2');
const menubar=document.getElementById('menubar')

const enmykill=document.getElementById('sound1')
const soundbackground=document.getElementById('sound2')
const collision_sound=document.getElementById('sound3')
const firing_sound=document.getElementById('sound4')





const canvas= document.querySelector('canvas');
canvas.width=innerWidth-5;
canvas.height=innerHeight-5;
const c=canvas.getContext('2d')

function gameover()
{
    const id=setTimeout(()=>{
       isGameStart=false
       gun.scale=0;
       menubar.style.display='flex'
       button1.style.display='flex'
       button2.style.display='flex'
       
       hints1.innerHTML="game over"
       button1.innerHTML='restart'
       button2.innerHTML="quit"
       button1.style.backgroundColor=' rgb(45, 210, 200)'
       button1.style.width='200px'
       button2.addEventListener('click',()=>{
           button2.style.color='white'
           button2.style.backgroundColor="red"
            const id= setTimeout(()=>{
               window.close();
               clearTimeout(id);
           },500)
       })
       clearTimeout(id)
     },800)
}

function levelShow()
{
    menubar.style.display='flex';
    button1.style.display='none';
    button2.style.display='none'
    hints1.innerHTML=`level ${gun.level}`;
    const id1=setTimeout(() => {
         menubar.style.display='none'   
         const id2= setTimeout(() => {
               i=0  //after 500 milisec of lavel showing  the game push new enmy
             clearTimeout(id2);
        },500);
     clearTimeout(id1)
    },1500);
}


 class Background{
    constructor()
    {
        this.image=new Image();
        this.image.src='imgs/background1.png';
        this.imageWidth=this.image.width;
        this.imageHeight=this.image.height;
    }
    draw()
    {
        c.drawImage(this.image,0,0,this.imageWidth*1.1,this.imageHeight);
    }
 }


 class plane{
     constructor({position,velocity,imageSrc,scale=.2})
     {
         this.velocity=velocity;
         this.position=position;
         this.scale=scale;

        //adding the image to the game  
         this.image=new Image();
         this.image.src=imageSrc;
           //image width or height implementation
         this.Width=this.image.width*scale;
         this.Height=this.image.height*scale;
         
         this.position.x=canvas.width/2-this.Width/2;// it makes the plane always center
         this.position.y=canvas.height-this.Height;
     
         this.roatation=0
         this.level=1;
         this.levelCount=10;
         this.life=5;
         this.autofire=false;
         
        }
        draw()
        {   
               if(this.image)
               {
                c.save();
                c.translate(this.position.x+this.Width/2,this.position.y+this.Height/2);
                c.rotate(this.roatation);
                c.translate(-this.position.x-this.Width/2,-this.position.y-this.Height/2);
                c.drawImage(this.image,this.position.x,this.position.y,this.Width,this.Height) 
                c.restore()
               }
         
        } 

     update()
     {
         this.draw();
        // for moving the plane in x axis
            this.position.x+=this.velocity.x;
        //for moving the plane in
           this.position.y+=this.velocity.y;
           evaders.forEach((enmy,index)=>{
               
               const plane_death_width=(this.position.x+this.Width)-(enmy.position.x+enmy.Width)
               const plane_death_height=(this.position.y+this.Height)-(enmy.position.y+enmy.Height)
               
               if( (plane_death_width<=this.Width) &&(plane_death_width+enmy.Width>=0)
               &&(plane_death_height<=this.Height)&&(plane_death_height>=0))
               {   

                     //making the anmation of loosing the life
                      planeHealth.style.backgroundColor=" rgb(255, 0, 0)"
                      planeHealth.style.transform="translate(210px)"
                      const id= setTimeout(()=>{
                      planeHealth.style.backgroundColor="rgba(0, 242, 255, 0.05)"
                      planeHealth.style.transform="translate(0px)";
                      clearTimeout(id);
                      },500)
                      // it is  the end of animation of loosing the life

                   collision_sound.load();
                   collision_sound.play();
        
                    evaders.splice(index,1)
                     if(i>0) //adding the new enmy while it vanished
                       i--;
                    if(this.life>0)
                    {
                        this.life--;
                        c.fillStyle="black";
                        c.fillRect(this.position.x,this.position.y,this.Width,this.Height)
                     }

                     if(!this.life)
                     {
                            i=-1 
                           soundbackground.pause(); 
                           gameover();    
                    }
               }
       })
    }
}


class Enmy{
    constructor({position,velocity,scale=.04})
    {
        this.velocity=velocity;
        this.position=position;
        this.scale=scale;

        this.image=new Image();
        this.image.src='imgs/enmy.png';

        this.Width=this.image.width*this.scale;
        this.Height=this.image.height*this.scale;

       }
       draw()
       {
           if(this.image)
           c.drawImage(this.image,this.position.x,this.position.y,this.Width,this.Height) 
       }   
    update()
    
    {
        this.draw();
       // for moving the enmy in x axis
         this.position.x+=this.velocity.x;
       //for moving the enmy in y axis
          this.position.y+=this.velocity.y;
  
   }
}

class Projectile
{
    constructor({ position,velocity,scale=.02})
    {
       this.position=position;
       this.velocity=velocity;
       this.radius=4;
    //    this.colorArray=['red','blue','green','pink','white']
    //    this.color=this.colorArray[Math.floor(Math.random()*this.colorArray.length)]
           
       this.image=new Image();
       this.image.src='imgs/missile.png';
     
       this.Width=this.image.width*scale;
       this.Height=this.image.height*scale;
    
    }
    draw()
    {  

      c.drawImage(this.image,this.position.x-this.Width/2,this.position.y-this.Height/2,this.Width,this.Height) 

    }
    update()
    {
        this.draw();
        this.position.x+=this.velocity.x;
        this.position.y+=this.velocity.y;

        // its the condition for collision point


        evaders.forEach((enmy,index)=>{
             const pos_of_collision_width=(enmy.position.x+enmy.Width)-(this.position.x+this.Width)
             const pos_of_collision_height=(enmy.position.y+enmy.Height)-(this.position.y+this.Height)

              if((pos_of_collision_width<=enmy.Width)&&(pos_of_collision_width+this.Width>=0)
                &&(pos_of_collision_height<=enmy.Height)&&(pos_of_collision_height+this.Height>=0))
                {  
                    enmykill.load();
                    enmykill.play();
                    
                    if(evaders.length<=1){
                        let id=setTimeout(()=>{
                              i=0
                              if(limitEnmy<20)
                                 limitEnmy+=2;     // when the screen will be empty 
                              clearTimeout(id);  
                          },1000)

                      }
                    
                    //this animation for strikenumber
                   strikenuber.style.backgroundColor="rgba(251, 7, 72, 0.832)"
                   strikenuber.style.transform="scale(1.13)"
                   //this animation for the restStirketonext
                   restStrikeToNext.style.backgroundColor=" rgb(255, 230, 0)"
                   restStrikeToNext.style.transform="rotate(360deg)"

                    const id= setTimeout(()=>{
                    strikenuber.style.backgroundColor="rgba(0, 242, 255, 0.05)"
                    strikenuber.style.transform="scale(1)"
                   //this animation for the restStirketonext

                   restStrikeToNext.style.backgroundColor="rgba(0, 242, 255, 0.05)"
                   restStrikeToNext.style.transform="rotate(0deg)"
                   clearTimeout(id)
                   },500)


                    setTimeout(()=>{
                        console.log(evaders.length)
                        strikeCount++;
                        if(gun.levelCount===strikeCount)
                        {  
                            
                            evaders.splice(0,evaders.length-1);
                            gun.levelCount+=gun.levelCount;
                            gun.level++;
                            if(enmy.velocity.y<=20)  //increasing the velosity of enmy while game jumps to next level
                                enmy.velocity.y+=2;


                          
                            //making the anmation of increasing the new level
                            currentLevel.style.backgroundColor="rgb(208, 255, 0)"
                            currentLevel.style.transform="translate(0,210px)"
                            const id1= setTimeout(()=>{
                            currentLevel.style.backgroundColor="rgba(0, 242, 255, 0.05)"
                            currentLevel.style.transform="translate(0,0)";
                            clearTimeout(id1);
                            },500)
                            // it is  the end of animation of increasing the new level
                            levelShow();

                        }
                     evaders.splice(index,1)
                     projectiles.splice(this,1)
                    },0)
                } 
        })
     
    }
}


var count=0
let enmyVelocity=1;
var isGameStart=true;
var lastkey;
const evaders=[];
const projectiles=[];
var i=0;
var limitEnmy=5;
var strikeCount=0;

//making the objets of keyboard switch
 const keys={
     a:{pressed:false},
     d:{pressed:false}, 
     w:{pressed:false},
     x:{pressed:false}
 }
   //creating the plane object
   const gun=new plane({
    position:{x:0,y:0},
    velocity:{ x:0,y:0},
    imageSrc:"imgs/myPlane.png",
    scale:.25 
 
  });

  const background=new Background()

// adding the enmy to the screen
  
   setInterval(()=>{
    if(i<limitEnmy&& i>=0 )
    {
        evaders.push(new Enmy({position:{x:Math.floor(Math.random()*canvas.width-25),y:0},velocity:{x:0,y:enmyVelocity}}))
         i++; 
    }
    
      },1000)
//ading the autofire
       
          setInterval(()=>{  
                if(gun.autofire)
                { 
                    firing_sound.load();
                    
                    projectiles.push(new Projectile({
                        position:{x:gun.position.x+gun.Width/2,y:gun.position.y},
                        velocity:{x:0,y:-10}
                    })) 
                    firing_sound.play();
                }
            
                },200)
        
 window.addEventListener('keydown',(event)=>{
     lastkey=event.key;

     switch(event.key)
     {
         case 'a':
            keys.a.pressed=true;
         break;
         case 'd':
            keys.d.pressed=true;
         break; 
         case 'w':
            keys.w.pressed=true;
         break; 
         case 'x':
            keys.x.pressed=true;
         break;  
         case 's':
                  if(gun.autofire)
                  {
                    clearTimeout(idautofire);
                    gun.autofire=false

                  }
                  else 
                  {
                    gun.autofire=true;
                     var idautofire =setTimeout(()=>{
                        gun.autofire=false;
                   
                      },5000)
                  }

         break;  
         case ' ':
            firing_sound.load();
            gun.autofire=true;
            if(gun.autofire)
            projectiles.push(new Projectile({
                position:{x:gun.position.x+gun.Width/2,y:gun.position.y},
                velocity:{x:0,y:-15}
            }))
            firing_sound.play();
            gun.autofire=false
           break; 

   
     }
 })
 window.addEventListener('keyup',(event)=>{

     switch(event.key)
     {
         case 'a':
            keys.a.pressed=false;
         break;
         case 'd':
            keys.d.pressed=false;
         break; 
         case 'w':
            keys.w.pressed=false;
         break; 
         case 'x':
            keys.x.pressed=false;
         break; 
     }
 })
 
 function animate()
 {
     if(isGameStart){
         requestAnimationFrame(animate);
        }
    c.clearRect(0,0,canvas.width,canvas.height)
    soundbackground.play()  
    background.draw();
    gun.update();   
     strikenuber.innerHTML=strikeCount   //adding the strikenumber to the html
     restStrikeToNext.innerHTML=gun.levelCount-strikeCount; //add remaining strikefor nextlevel to the html
     currentLevel.innerHTML=gun.level;//adding the level of the game
     planeHealth.innerHTML=gun.life;

   

     projectiles.forEach((projectile,index)=>{
       
        if(projectile.position.y+projectile.Height<=0)
        {
           setTimeout(()=>{
               projectiles.splice(index,1)
           },0)
        }
        else
          projectile.update();
     })

     //for  enmy creation dyanmamic 
     evaders.forEach((enmy,index)=>{
         if(enmy.position.y+enmy.Height>=canvas.height)
         {
            setTimeout(()=>{
                evaders.splice(index,1);
                if(i>0)
                {
                    i--;
                }
            },0)
         }
         else
          enmy.update();
        })

        if(keys.d.pressed && lastkey==='d'&& gun.position.x+gun.Width/2<=canvas.width)
        {
            gun.roatation=.15;
            gun.velocity.x=10;
        }
        else if(keys.a.pressed && lastkey==='a'&& gun.position.x+gun.Width/2>=0)
        {
            gun.roatation=-.15;
            gun.velocity.x=-10;

        }
        else{
            gun.roatation=0;
            gun.velocity.x=0;
        }
            
        
        if(keys.w.pressed && lastkey==='w'&&gun.position.y>=0)
        {
        
            gun.velocity.y=-10;
        }
        else if(keys.x.pressed && lastkey==='x' && gun.position.y+gun.Height<=canvas.height)
        {
            gun.velocity.y=10;
        }
        else
            gun.velocity.y=0;

    
   }
   //it is the start interface of the game

   hints1.style.display='block'
   hints1.innerHTML='Enter start to start the game';
   hints2.style.display='block'
   hints2.innerHTML="click 'a'-left 'd'-right 'w'-up 'x'-down 'space'-shoot and 's'-autoshoot";
  button1.innerHTML='start'
  button1.style.display='flex'
         button1.addEventListener('click',()=>{
                button1.style.color='white';
                button1.style.backgroundColor='green'
                button1.style.transform='scale(1.15)'
                
                    isGameStart=true;
                    evaders.splice(0,evaders.length)
                    projectiles.splice(0,projectiles.length)
                    soundbackground.load()  
                
                    //after 400 miliseconds the game will start
                    const id= setTimeout(()=>{
                        i=0// initialization of enmy looping
                        strikeCount=0
                        limitEnmy=5;
                        gun.life=5;
                        gun.levelCount=10
                        gun.level=1;
                        enmyVelocity=1;
                        gun.position.x=canvas.width/2-gun.Width/2;// it makes the plane always center
                        gun.position.y=canvas.height-gun.Height;
                        menubar.style.display='none'
                        animate(); 
                        levelShow();
                clearTimeout(id);
                },500)
            
    })
       