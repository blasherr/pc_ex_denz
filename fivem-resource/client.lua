-- ██████████████████████████████████████████████████████████
-- ██  CERBERUS OS - Client Script                       ██
-- ██████████████████████████████████████████████████████████

local isOpen = false

-- ============================================================
-- COMMANDE POUR OUVRIR LE PC
-- ============================================================
-- Tu peux changer 'pc' par ce que tu veux
RegisterCommand('pc', function()
    if isOpen then
        ClosePC()
    else
        OpenPC()
    end
end, false)

-- Keybind optionnel (F5 par défaut)
RegisterKeyMapping('pc', 'Ouvrir CERBERUS OS', 'keyboard', 'F5')

-- ============================================================
-- OUVRIR LE PC
-- ============================================================
function OpenPC()
    if isOpen then return end
    isOpen = true
    
    SetNuiFocus(true, true)  -- Activer le focus souris + clavier
    SendNUIMessage({
        type = 'open'
    })
    
    -- Désactiver les contrôles du jeu
    CreateThread(function()
        while isOpen do
            DisableAllControlActions(0)
            Wait(0)
        end
    end)
end

-- ============================================================
-- FERMER LE PC
-- ============================================================
function ClosePC()
    if not isOpen then return end
    isOpen = false
    
    SetNuiFocus(false, false)  -- Désactiver le focus
    SendNUIMessage({
        type = 'close'
    })
end

-- ============================================================
-- NUI CALLBACKS (réponses du navigateur)
-- ============================================================

-- Quand le UI est prêt
RegisterNUICallback('uiReady', function(data, cb)
    print('[CERBERUS OS] UI chargé et prêt')
    cb('ok')
end)

-- Quand le joueur se connecte sur le PC
RegisterNUICallback('loggedIn', function(data, cb)
    print('[CERBERUS OS] Joueur connecté au système')
    cb('ok')
end)

-- Quand le joueur ferme le PC (via Escape dans le NUI)
RegisterNUICallback('closeUI', function(data, cb)
    ClosePC()
    cb('ok')
end)

-- Quand le UI est fermé
RegisterNUICallback('uiClosed', function(data, cb)
    print('[CERBERUS OS] UI fermé')
    cb('ok')
end)

-- ============================================================
-- EXPORT (pour que d'autres scripts puissent ouvrir/fermer)
-- ============================================================
exports('OpenPC', OpenPC)
exports('ClosePC', ClosePC)
exports('IsOpen', function() return isOpen end)

-- ============================================================
-- EXEMPLES D'UTILISATION AVANCÉE (décommente si besoin)
-- ============================================================

-- Ouvrir le PC quand le joueur est près d'un objet
--[[
CreateThread(function()
    while true do
        Wait(500)
        local ped = PlayerPedId()
        local coords = GetEntityCoords(ped)
        
        -- Coordonnées de l'ordinateur dans le monde
        local pcCoords = vector3(0.0, 0.0, 0.0)  -- CHANGE CES COORDONNÉES
        local distance = #(coords - pcCoords)
        
        if distance < 2.0 then
            -- Afficher un texte d'aide
            SetTextComponentFormat('STRING')
            AddTextComponentString('~INPUT_CONTEXT~ Utiliser le PC')
            DisplayHelpTextFromStringLabel(0, false, true, -1)
            
            -- Appuyer sur E pour ouvrir
            if IsControlJustReleased(0, 38) then -- E
                OpenPC()
            end
        end
    end
end)
--]]
