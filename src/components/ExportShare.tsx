import React, { useState, useRef } from 'react';
import { Share2, Download, Copy, Check, Image } from 'lucide-react';
import { Recipe } from '../types/Recipe';

interface ExportShareProps {
  recipe: Recipe;
  t: (key: string) => string;
}

export const ExportShare: React.FC<ExportShareProps> = ({ recipe, t }) => {
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const formatRecipe = (): string => {
    const title = `${t('title')}\n${t('subtitle')}\n${'='.repeat(30)}\n\n`;
    
    const ingredients = recipe.ingredients.map(ing => {
      const amount = Math.round(ing.amount);
      return `• ${t(ing.name)}: ${amount} ${t(ing.unit)}`;
    }).join('\n');
    
    const volume = `\n\n${t('estimatedVolume')}: ${recipe.totalVolume} ${t('liters')}`;
    
    return title + ingredients + volume;
  };

  const generateRecipeImage = (): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = canvasRef.current;
      if (!canvas) return resolve('');
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return resolve('');
      
      // Set canvas size
      canvas.width = 800;
      canvas.height = 1000;
      
      // Create parchment background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#FFFBEB');
      gradient.addColorStop(0.5, '#FEF3C7');
      gradient.addColorStop(1, '#F59E0B');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Add aged paper texture
      ctx.fillStyle = 'rgba(180, 83, 9, 0.1)';
      for (let i = 0; i < 100; i++) {
        ctx.beginPath();
        ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 3, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Add decorative border
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 8;
      ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);
      
      // Inner border
      ctx.strokeStyle = '#92400E';
      ctx.lineWidth = 2;
      ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);
      
      // Title
      ctx.fillStyle = '#92400E';
      ctx.font = 'bold 48px serif';
      ctx.textAlign = 'center';
      ctx.fillText(t('title'), canvas.width / 2, 120);
      
      // Subtitle
      ctx.font = 'italic 24px serif';
      ctx.fillText(t('subtitle'), canvas.width / 2, 160);
      
      // Decorative line
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(200, 190);
      ctx.lineTo(600, 190);
      ctx.stroke();
      
      // Ingredients
      ctx.font = '28px serif';
      ctx.textAlign = 'left';
      ctx.fillStyle = '#78350F';
      
      let yPos = 250;
      recipe.ingredients.forEach((ingredient, index) => {
        const amount = Math.round(ingredient.amount);
        const text = `${t(ingredient.name)}: ${amount} ${ingredient.unit}`;
        ctx.fillText(`• ${text}`, 100, yPos);
        yPos += 50;
      });
      
      // Volume estimation
      yPos += 30;
      ctx.font = 'bold 24px serif';
      ctx.fillStyle = '#92400E';
      ctx.fillText(`${t('estimatedVolume')}: ${recipe.totalVolume} ${t('liters')}`, 100, yPos);
      
      // Footer decoration
      ctx.font = 'italic 18px serif';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#A16207';
      ctx.fillText('Traditional Spanish Recipe', canvas.width / 2, canvas.height - 80);
      
      // Convert to data URL
      resolve(canvas.toDataURL('image/png', 0.9));
    });
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formatRecipe());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy recipe:', err);
    }
  };

  const handleDownload = () => {
    const content = formatRecipe();
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'juanje-gazpacho-recipe.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImageShare = async () => {
    try {
      const imageDataUrl = await generateRecipeImage();
      
      // Convert data URL to blob
      const response = await fetch(imageDataUrl);
      const blob = await response.blob();
      
      if (navigator.share && navigator.canShare({ files: [new File([blob], 'gazpacho-recipe.png', { type: 'image/png' })] })) {
        await navigator.share({
          title: t('title'),
          files: [new File([blob], 'gazpacho-recipe.png', { type: 'image/png' })]
        });
      } else {
        // Fallback: download the image
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'juanje-gazpacho-recipe.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error('Failed to share image:', err);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: t('title'),
          text: formatRecipe()
        });
      } catch (err) {
        handleCopy();
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="space-y-3">
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      
      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleImageShare}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 
                   text-white rounded-md shadow-sm transition-colors duration-200
                   focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        >
          <Image size={16} />
          Share Image
        </button>
        
        <button
          onClick={handleShare}
          className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 
                   text-white rounded-md shadow-sm transition-colors duration-200
                   focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
        >
          <Share2 size={16} />
          {t('share')}
        </button>
      </div>
      
      <div className="flex flex-wrap gap-2">
      <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 
                 text-white rounded-md shadow-sm transition-colors duration-200
                   focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
      >
          <Download size={16} />
          {t('export')}
      </button>
      
      <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 
                 text-white rounded-md shadow-sm transition-colors duration-200
                   focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
          {copied ? <Check size={16} /> : <Copy size={16} />}
          {copied ? 'Copied!' : 'Copy'}
      </button>
      </div>
    </div>
  );
};