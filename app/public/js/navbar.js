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
let site = 'https://policies.google.com/technologies/partner-sites?hl=en';


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
                description :  'We use cookies to ensure basic features and functionalities on the website and to enable optimization and targeting in the hopes of enhancing your experience with our brand. You can choose your cookie settings here.',
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
               title : '',
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
                       title : "Cookie settings",
                       description: 'We use cookies to ensure basic features and functionalities on the website and to enable optimization and targeting in the hopes of enhancing your experience with our brand. You can choose your cookie settings here.'
                   },{
                       title : "Necessary cookies",
                       description: 'These cookies are essential for the proper functioning of my website. Without these cookies, the website would not work properly.',
                       toggle : {
                           value : 'necessary_cookies',
                           enabled : true,
                           readonly: false
                       },
                       cookie_table: [
                        {
                            col1: 'cart',
                            col2: 'blokkers.dk',
                            col3: '30 days',
                            col4: 'Supports the technical features of the website to create a seamless shopping experience.' ,
                            col5: 'Permanent cookie'
                        },
                        {
                            col1: 'visid_incap_',
                            col2: 'blokkers.dk',
                            col3: '1 year',
                            col4: 'Supports the technical features of the website to create a seamless shopping experience.' ,
                            col5: 'Permanent cookie'
                        },
                        {
                            col1: 'visid_incap_',
                            col2: 'blokkers.dk',
                            col3: 'session',
                            col4: 'Supports the technical features of the website to create a seamless shopping experience.' ,
                            col5: 'Temporary cookie'
                        },
                        {
                            col1: 'cc_cookies',
                            col2: 'blokkers.dk',
                            col3: '30 days',
                            col4: 'Supports the technical features of the website to create a seamless shopping experience.' ,
                            col5: 'Permanent cookie'
                        },
                    ]
                   },{
                       title : "Statistics cookies",
                       description: 'These cookies collect anonymized information about you and how you use the website for optimization and marketing purposes. We value your integrity and make sure that the collected data can’t be used to identify you.',
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
                               col4: 'Collects information about the user and it’s activity on the website for analyzing and reporting purposes. For more info about how Google uses information from our website read our Privacy Policy.',
                               col5: 'Permanent cookie'
                           },
                           {
                               col1: '_gat',
                               col2: 'google.com',
                               col3: '1 minute',
                               col4: 'Collects information about the user and it’s activity on the website for analyzing and reporting purposes. For more info about how Google uses information from our website read our Privacy Policy.',
                               col5: 'Permanent cookie'
                           },
                           {
                               col1: '_gid',
                               col2: 'google.com',
                               col3: '1 day',
                               col4: 'Collects information about the user and it’s activity on the website for analyzing and reporting purposes. For more info about how Google uses information from our website read our Privacy Policy.',
                               col5: 'Permanent cookie'
                           }
                       ]
                   },{
                       title : "More information",
                       description: 'For any questions in relation to our privacy policy, use of cookies and your right and options, please read our <a class="cc-link" href="/privacypolicy">Privacy policy</a>.',
                   }
               ]
           }
       }
   }
});
