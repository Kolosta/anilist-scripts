// ==UserScript==
// @name         Dupliquer icône notification AniList (auto)
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Ajoute une icône de notification à côté de l'avatar et l'icone de loupe pour rechercher un anime sur AniList.co
// @author       Toi
// @match        https://anilist.co/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function insertNotificationIcon() {
        const notificationLink = document.querySelector('a[href="/notifications"]');
        const searchIcon = document.querySelector('.search');
        const userIcon = document.querySelector('.user');

        if (!notificationLink || !searchIcon || !userIcon) return;

        // Vérifier si l'icône existe déjà pour éviter les doublons
        if (document.querySelector('.custom-notification-icon')) return;

        // Extraire le SVG de l'icône
        const svgIcon = notificationLink.querySelector('svg')?.cloneNode(true);
        if (!svgIcon) return;

        // Créer un lien cliquable autour de l'icône
        const newNotificationLink = document.createElement('a');
        newNotificationLink.href = "/notifications";
        newNotificationLink.classList.add('search', 'custom-notification-icon');
        newNotificationLink.appendChild(svgIcon);

        // Insérer avant l'icône utilisateur
        userIcon.parentNode.insertBefore(newNotificationLink, userIcon);
    }

    // Observer les mutations du DOM pour détecter l'icône de notification et l'injecter dès que possible
    const observer = new MutationObserver(() => {
        insertNotificationIcon();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Ajouter immédiatement si l'élément est déjà chargé
    insertNotificationIcon();

    // Ajouter du style pour que l'icône ressemble à celle de la loupe et change dynamiquement de couleur
    const style = document.createElement('style');
    style.textContent = `
        .search {
            position: relative;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 24px;
            height: 24px;
            margin: 0 10px 0 5px;
            text-decoration: none;
        }

        /* Transition globale sur toutes les icônes */
        .search svg {
            width: 100%;
            height: 100%;
            fill: currentColor;
            cursor: pointer;
            transition: color .3s ease; /* Ajout ici */
        }

        /* Couleur par défaut */
        .nav.nav-unscoped .search svg {
            color: #777a9e;
        }

        /* Si la navbar est transparente */
        .nav.nav-unscoped.transparent .search svg {
            color: rgba(191, 193, 212, .65);
        }

        /* Effet au survol */
        .nav.nav-unscoped .search:hover svg,
        .nav.nav-unscoped.transparent .search:hover svg {
            color: #d3d5f3;
        }
    `;
    document.head.appendChild(style);
})();
