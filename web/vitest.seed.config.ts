import { defineConfig } from 'vitest/config'

/**
 * Configuration dédiée au générateur de migration.
 *
 * La configuration principale exclut `scripts/` des exécutions de la suite — le
 * générateur écrit un fichier et ne vérifie rien, il n'a pas sa place dans un
 * `npm test`. L'exclusion de la ligne de commande s'ajoutant à celle du fichier
 * au lieu de la remplacer, il lui faut sa propre configuration.
 */
export default defineConfig({
  test: {
    include: ['scripts/generer-seed.test.ts'],
    environment: 'node',
  },
})
