document.addEventListener('keydown', (event) => {
   if (event.key === 'Escape') {
      // close modal here
      closeNav();
   }
});

function openNav() {
   document.getElementById("mySidenav").style.width = "250px";
};

function closeNav() {
   document.getElementById("mySidenav").style.width = "0";
};

$(document).ready(function () {

   $(".menu-toggle").mouseleave(function(){
     closeNav();
   });
 });

function closeHeader() {
   $("#nav-header").hide(400).fadeOut(400)

};
let cookieconsent = initCookieConsent();

cookieconsent.run({
   autorun : true, 							
   delay : 0,
   current_lang : 'en',
   theme_css : "../css/cookieconsent.css",		
   autoclear_cookies : true,	
   autoload_css : true, 
   cookie_expiration : 30,
      
      onAccept: function(cookies){				
          if(cookieconsent.allowedCategory('analytics_cookies')){
            cookieconsent.loadScript('https://www.googletagmanager.com/gtag/js?id=G-5Z8RG3W26R', function(){		
               window.dataLayer = window.dataLayer || [];
               function gtag(){dataLayer.push(arguments);}
               gtag('js', new Date());
             
               gtag('config', 'G-5Z8RG3W26R');
              });
          }
      },
   
 
    languages : {
        en : {
            consent_modal : {
                logo: `<img id="logo" src="images/Blokkers_logo.png">`,
                title :  "We value your integrity",
                description :  'We and our partners use cookies to be able to provide you with a personalized shopping experience. When you click accept you allow the use of all cookies including essentials and third-party marketing cookies.',
                primary_btn: {
                    text: 'Accept',
                    role: 'accept_all'  //'accept_selected' or 'accept_all'
                },
                secondary_btn: {
                    text : 'Settings',
                    role : 'settings'   //'settings' or 'accept_necessary'
                }
            },
            settings_modal : {
               title : 'Cookie preferences',
               save_settings_btn : "Save settings",
               accept_all_btn : "Accept all",
               cookie_table_headers : [
                   {col1: "Name" }, 
                   {col2: "Domain" }, 
                   {col3: "Expiration" }, 
                   {col4: "Description" }, 
                   {col5: "Type" }
               ],
               blocks : [
                   {
                       title : "Cookie usage",
                       description: 'Blokkers use cookies to ensure the basic functionalities of the website and to enhance your online experience. You can choose for each category to opt-in/out whenever you want.'
                   },{
                       title : "Strictly necessary cookies",
                       description: 'These cookies are essential for the proper functioning of my website. Without these cookies, the website would not work properly.',
                       toggle : {
                           value : 'necessary_cookies',
                           enabled : true,
                           readonly: true
                       }
                   },{
                       title : "Analytics cookies",
                       description: 'These cookies ollect information about how you use the website, which pages you visited and which links you clicked on. All of the data is anonymized and cannot be used to identify you.',
                       toggle : {
                           value : 'analytics_cookies',
                           enabled : false,
                           readonly: false
                       },
                       cookie_table: [
                           {
                               col1: '_ga',
                               col2: 'google.com',
                               col3: '2 years',
                               col4: 'description ...' ,
                               col5: 'Permanent cookie'
                           },
                           {
                               col1: '_gat',
                               col2: 'google.com',
                               col3: '1 minute',
                               col4: 'description ...' ,
                               col5: 'Permanent cookie'
                           },
                           // {
                           //     col1: '_gid',
                           //     col2: 'google.com',
                           //     col3: '1 day',
                           //     col4: 'description ...' ,
                           //     col5: 'Permanent cookie'
                           // }
                       ]
                   },{
                       title : "More information",
                       description: 'For any queries in relation to our policy on cookies and your choices, please read the <a class="cc-link" href="#yourwebsite">Privacy policy</a>.',
                   }
               ]
           }
       }
   }
});


