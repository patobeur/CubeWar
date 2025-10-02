window.onload = function init() {
	const selectionModal = document.getElementById('selection-modal');
	const selectionForm = document.getElementById('player-selection-form');
	const factionSelect = document.getElementById('faction-select');
	const roleSelect = document.getElementById('role-select');

	selectionForm.addEventListener('submit', (event) => {
		event.preventDefault();

		const selectedFaction = factionSelect.value;
		const selectedRole = roleSelect.value;

		selectionModal.style.display = 'none';

		const uiElements = {
			targetNotification: document.getElementById('target-notification'),
			attackerCard: document.getElementById('attacker-card'),
			attackerName: document.getElementById('attacker-name'),
			attackerRole: document.getElementById('attacker-role'),
			attackerHp: document.getElementById('attacker-hp'),
		};

		// Pass the selected options to the Game constructor
		let game = new Game(selectedFaction, selectedRole, uiElements);
	});
};